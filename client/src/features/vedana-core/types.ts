export const EVENT_TYPES = [
  "PATIENT_REPORT", "FUNCTIONAL_OBSERVATION", "PALPATORY_FINDING",
  "THERAPIST_INTERPRETATION", "THERAPEUTIC_INPUT", "SYSTEM_RESPONSE",
  "RETEST", "THERAPIST_DECISION", "UNKNOWN",
] as const;

export type SessionEventType = (typeof EVENT_TYPES)[number];

export interface SessionEvent {
  id: string;
  timestamp: string;
  type: SessionEventType;
  originalText: string;
  editedText: string;
  confirmed: boolean;
  order: number;
}

export interface VisitAnalysisData {
  functionalProblem: string[];
  systemChangeHistory: string[];
  examinationSignals: string[];
  stoppingPoint: string[];
  appliedStimulus: string[];
  localResponse: string[];
  globalResponse: string[];
  retest: string[];
  unknownInformation: string[];
  nextDirection: string[];
}
