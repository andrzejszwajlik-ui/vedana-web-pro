import { describe, expect, it } from "vitest";
import { generateAnalysis, TEST_CASE, transcriptToEvents, updateEvent } from "./core";

describe("Vedana Core", () => {
  it("zachowuje kolejność zdarzeń", () => { const events = transcriptToEvents("Pierwsze. Drugie. Trzecie.", new Date(0)); expect(events.map(e => e.order)).toEqual([0, 1, 2]); expect(events.map(e => e.editedText)).toEqual(["Pierwsze.", "Drugie.", "Trzecie."]); });
  it("zmienia typ zdarzenia", () => { const events = transcriptToEvents("Notatka."); const changed = updateEvent(events, events[0].id, { type: "RETEST" }); expect(changed[0].type).toBe("RETEST"); });
  it("zatwierdza zdarzenie", () => { const events = transcriptToEvents("Notatka."); const changed = updateEvent(events, events[0].id, { confirmed: true }); expect(changed[0].confirmed).toBe(true); });
  it("generuje analizę przypadku testowego z zatwierdzonych zdarzeń", () => { const events = transcriptToEvents(TEST_CASE).map(e => ({ ...e, confirmed: true })); const analysis = generateAnalysis(events); expect(analysis.functionalProblem.join(" ")).toContain("nie może się wyprostować"); expect(analysis.stoppingPoint.join(" ")).toContain("Blizna twarda"); expect(analysis.appliedStimulus.join(" ")).toContain("Utrzymuję kontakt"); expect(analysis.retest.join(" ")).toContain("Sprawdzam ponownie"); });
});
