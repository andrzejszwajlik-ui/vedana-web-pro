import type { SessionEvent, SessionEventType, VisitAnalysisData } from "./types";

export const TEST_CASE = "Pacjentka od miesiąca nie może się wyprostować. Problem zaczął się podczas wieszania firanek. W wywiadzie appendektomia. Blizna twarda i mało przesuwalna dogłowowo. Przy wyproście opór rośnie. Utrzymuję kontakt w kierunku oporu. Pojawia się głębszy oddech. Napięcie zmniejsza się. Sprawdzam ponownie wyprost. Wyprost prawie pełny, ból mniejszy.";

const rules: Array<[SessionEventType, RegExp]> = [
  ["RETEST", /sprawdzam ponownie|retest|po terapii/i],
  ["THERAPEUTIC_INPUT", /utrzymuję kontakt|mobiliz|ucisk|bodziec/i],
  ["PALPATORY_FINDING", /blizna|palpacyj|twarda|przesuwalna/i],
  ["FUNCTIONAL_OBSERVATION", /przy wyproście|opór rośnie|zakres ruchu/i],
  ["SYSTEM_RESPONSE", /oddech|napięcie zmniejsza|rozluź/i],
  ["THERAPIST_DECISION", /dalsz|zalecam|decyduję/i],
  ["THERAPIST_INTERPRETATION", /wywiadzie|interpretuję|wiążę/i],
  ["PATIENT_REPORT", /pacjent|ból|problem|nie może|zacz/i],
];

export function classifyText(text: string): SessionEventType {
  return rules.find(([, pattern]) => pattern.test(text))?.[0] ?? "UNKNOWN";
}

export function transcriptToEvents(transcript: string, now = new Date()): SessionEvent[] {
  return (transcript.match(/[^.!?]+[.!?]?/g) ?? [])
    .map(text => text.trim()).filter(Boolean).map((text, order) => ({
      id: `${now.getTime()}-${order}`,
      timestamp: new Date(now.getTime() + order * 1000).toISOString(),
      type: classifyText(text), originalText: text, editedText: text,
      confirmed: false, order,
    }));
}

export function updateEvent(events: SessionEvent[], id: string, patch: Partial<SessionEvent>) {
  return events.map(event => event.id === id ? { ...event, ...patch } : event)
    .sort((a, b) => a.order - b.order);
}

const texts = (events: SessionEvent[], types: SessionEventType[]) => events
  .filter(e => e.confirmed && types.includes(e.type)).map(e => e.editedText);

export function generateAnalysis(events: SessionEvent[]): VisitAnalysisData {
  return {
    functionalProblem: texts(events, ["PATIENT_REPORT", "FUNCTIONAL_OBSERVATION"]),
    systemChangeHistory: texts(events, ["PATIENT_REPORT", "THERAPIST_INTERPRETATION"]),
    examinationSignals: texts(events, ["FUNCTIONAL_OBSERVATION", "PALPATORY_FINDING"]),
    stoppingPoint: texts(events, ["PALPATORY_FINDING"]),
    appliedStimulus: texts(events, ["THERAPEUTIC_INPUT"]),
    localResponse: texts(events, ["SYSTEM_RESPONSE"]),
    globalResponse: texts(events, ["SYSTEM_RESPONSE"]),
    retest: texts(events, ["RETEST"]),
    unknownInformation: texts(events, ["UNKNOWN"]),
    nextDirection: texts(events, ["THERAPIST_DECISION"]),
  };
}
