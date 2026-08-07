import type {
  SessionEvent,
  SessionEventType,
  VisitAnalysisData,
} from "./types";

export const TEST_CASE =
  "Pacjentka od miesiąca nie może się wyprostować. Problem zaczął się podczas wieszania firanek. W wywiadzie appendektomia. Blizna twarda i mało przesuwalna dogłowowo. Przy wyproście opór rośnie. Utrzymuję kontakt w kierunku oporu. Pojawia się głębszy oddech. Napięcie zmniejsza się. Sprawdzam ponownie wyprost. Wyprost prawie pełny, ból mniejszy.";

const retestResultPattern =
  /wyprost (?:prawie )?pełny|ból (?:mniejszy|większy)|ruch pełniejszy|zakres większy|funkcja bez zmiany|bez zmiany po (?:terapii|interwencji)/i;

const rules: Array<[SessionEventType, RegExp]> = [
  [
    "RETEST",
    /sprawdzam ponownie|retest|po terapii|wyprost (?:prawie )?pełny|ból (?:mniejszy|większy)|ruch pełniejszy|zakres większy|funkcja bez zmiany/i,
  ],
  ["THERAPEUTIC_INPUT", /utrzymuję kontakt|mobiliz|ucisk|bodziec/i],
  ["PALPATORY_FINDING", /blizna|palpacyj|twarda|przesuwalna/i],
  ["FUNCTIONAL_OBSERVATION", /przy wyproście|opór rośnie|zakres ruchu/i],
  ["SYSTEM_RESPONSE", /oddech|napięcie zmniejsza|rozluź/i],
  ["THERAPIST_DECISION", /dalsz|zalecam|decyduję/i],
  ["THERAPIST_INTERPRETATION", /wywiadzie|interpretuję|wiążę/i],
  ["PATIENT_REPORT", /pacjent|ból|problem|nie może|zacz/i],
];

const localResponsePattern =
  /tkank|ślizg|tward|napięc|opór|blizn|przesuwal/i;
const globalResponsePattern =
  /oddech|ból|wyprost|postaw|ruch|funkcj|chód|chodz|rotacj|zgięc/i;
const unknownInformationPattern =
  /nie wiadomo|brak danych|nie sprawdzono|nie oceniono|nie badano/i;

export function classifyText(text: string): SessionEventType {
  return rules.find(([, pattern]) => pattern.test(text))?.[0] ?? "UNKNOWN";
}

export function transcriptToEvents(
  transcript: string,
  now = new Date(),
): SessionEvent[] {
  const sentences = (transcript.match(/[^.!?]+[.!?]?/g) ?? [])
    .map(text => text.trim())
    .filter(Boolean);

  return sentences.map((text, order) => {
    const previousText = sentences[order - 1] ?? "";
    const followsRetestPrompt = /sprawdzam ponownie|retest/i.test(previousText);
    const type =
      followsRetestPrompt && retestResultPattern.test(text)
        ? "RETEST"
        : classifyText(text);

    return {
      id: `${now.getTime()}-${order}`,
      timestamp: new Date(now.getTime() + order * 1000).toISOString(),
      type,
      originalText: text,
      editedText: text,
      confirmed: false,
      order,
    };
  });
}

export function updateEvent(
  events: SessionEvent[],
  id: string,
  patch: Partial<SessionEvent>,
) {
  return events
    .map(event => (event.id === id ? { ...event, ...patch } : event))
    .sort((a, b) => a.order - b.order);
}

const texts = (events: SessionEvent[], types: SessionEventType[]) =>
  events
    .filter(event => event.confirmed && types.includes(event.type))
    .map(event => event.editedText);

const matchingTexts = (
  events: SessionEvent[],
  types: SessionEventType[],
  pattern: RegExp,
) =>
  events
    .filter(
      event =>
        event.confirmed &&
        types.includes(event.type) &&
        pattern.test(event.editedText),
    )
    .map(event => event.editedText);

export function generateAnalysis(events: SessionEvent[]): VisitAnalysisData {
  return {
    functionalProblem: texts(events, [
      "PATIENT_REPORT",
      "FUNCTIONAL_OBSERVATION",
    ]),
    systemChangeHistory: texts(events, [
      "PATIENT_REPORT",
      "THERAPIST_INTERPRETATION",
    ]),
    examinationSignals: texts(events, [
      "FUNCTIONAL_OBSERVATION",
      "PALPATORY_FINDING",
    ]),
    stoppingPoint: texts(events, ["PALPATORY_FINDING"]),
    appliedStimulus: texts(events, ["THERAPEUTIC_INPUT"]),
    localResponse: matchingTexts(
      events,
      ["SYSTEM_RESPONSE", "RETEST"],
      localResponsePattern,
    ),
    globalResponse: matchingTexts(
      events,
      ["SYSTEM_RESPONSE", "RETEST"],
      globalResponsePattern,
    ),
    retest: texts(events, ["RETEST"]),
    unknownInformation: events
      .filter(
        event =>
          event.confirmed && unknownInformationPattern.test(event.editedText),
      )
      .map(event => event.editedText),
    nextDirection: texts(events, ["THERAPIST_DECISION"]),
  };
}
