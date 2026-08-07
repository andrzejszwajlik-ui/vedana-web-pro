import { describe, expect, it } from "vitest";
import {
  generateAnalysis,
  TEST_CASE,
  transcriptToEvents,
  updateEvent,
} from "./core";

describe("Vedana Core", () => {
  it("zachowuje kolejność zdarzeń", () => {
    const events = transcriptToEvents(
      "Pierwsze. Drugie. Trzecie.",
      new Date(0),
    );

    expect(events.map(event => event.order)).toEqual([0, 1, 2]);
    expect(events.map(event => event.editedText)).toEqual([
      "Pierwsze.",
      "Drugie.",
      "Trzecie.",
    ]);
  });

  it("zmienia typ zdarzenia", () => {
    const events = transcriptToEvents("Notatka.");
    const changed = updateEvent(events, events[0].id, { type: "RETEST" });

    expect(changed[0].type).toBe("RETEST");
  });

  it("zatwierdza zdarzenie", () => {
    const events = transcriptToEvents("Notatka.");
    const changed = updateEvent(events, events[0].id, { confirmed: true });

    expect(changed[0].confirmed).toBe(true);
  });

  it("klasyfikuje wynik bezpośrednio po reteście jako RETEST", () => {
    const events = transcriptToEvents(
      "Sprawdzam ponownie wyprost. Wyprost prawie pełny, ból mniejszy.",
    );

    expect(events).toHaveLength(2);
    expect(events[0].type).toBe("RETEST");
    expect(events[1].type).toBe("RETEST");
  });

  it("rozdziela odpowiedź miejscową od globalnej", () => {
    const events = transcriptToEvents(
      "Napięcie zmniejsza się. Pojawia się głębszy oddech. Wyprost prawie pełny, ból mniejszy.",
    ).map(event => ({ ...event, confirmed: true }));

    const analysis = generateAnalysis(events);

    expect(analysis.localResponse.join(" ")).toContain("Napięcie zmniejsza");
    expect(analysis.localResponse.join(" ")).not.toContain("głębszy oddech");
    expect(analysis.globalResponse.join(" ")).toContain("głębszy oddech");
    expect(analysis.globalResponse.join(" ")).toContain("Wyprost prawie pełny");
  });

  it("nie traktuje każdego UNKNOWN jako informacji nieznanej", () => {
    const events = transcriptToEvents(
      "Luźna notatka. Brak danych o trwałości efektu.",
    ).map(event => ({ ...event, confirmed: true }));

    const analysis = generateAnalysis(events);

    expect(analysis.unknownInformation).toEqual([
      "Brak danych o trwałości efektu.",
    ]);
    expect(analysis.unknownInformation.join(" ")).not.toContain("Luźna notatka");
  });

  it("generuje analizę przypadku testowego z zatwierdzonych zdarzeń", () => {
    const events = transcriptToEvents(TEST_CASE).map(event => ({
      ...event,
      confirmed: true,
    }));
    const analysis = generateAnalysis(events);

    expect(analysis.functionalProblem.join(" ")).toContain(
      "nie może się wyprostować",
    );
    expect(analysis.stoppingPoint.join(" ")).toContain("Blizna twarda");
    expect(analysis.appliedStimulus.join(" ")).toContain("Utrzymuję kontakt");
    expect(analysis.retest.join(" ")).toContain("Sprawdzam ponownie");
    expect(analysis.retest.join(" ")).toContain("Wyprost prawie pełny");
  });
});
