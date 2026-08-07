import { useEffect, useState } from "react";
import { Activity, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PatientSelector } from "./PatientSelector";
import { ListeningPanel } from "./ListeningPanel";
import { SessionTimeline } from "./SessionTimeline";
import { TestCaseLoader } from "./TestCaseLoader";
import { VisitAnalysis } from "./VisitAnalysis";
import { generateAnalysis, TEST_CASE, transcriptToEvents } from "./core";
import type { SessionEvent, VisitAnalysisData } from "./types";

const defaults = ["Anna Kowalska", "Marek Nowak", "Julia Wiśniewska"];
export default function VedanaCorePage({ standalone = false }: { standalone?: boolean }) {
  const [patients, setPatients] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem("vedana-core-patients") || "null") || defaults; } catch { return defaults; } });
  const [patient, setPatient] = useState(""); const [transcript, setTranscript] = useState(""); const [events, setEvents] = useState<SessionEvent[]>([]); const [analysis, setAnalysis] = useState<VisitAnalysisData | null>(null);
  useEffect(() => localStorage.setItem("vedana-core-patients", JSON.stringify(patients)), [patients]);
  const finish = () => { setEvents(transcriptToEvents(transcript)); setAnalysis(null); };
  const loadTest = () => { setTranscript(TEST_CASE); setEvents([]); setAnalysis(null); if (!patient) setPatient(defaults[0]); };
  return <main className="min-h-screen bg-[#f4f7f6] text-slate-900"><header className="border-b bg-white"><div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5"><div className="flex items-center gap-3"><span className="rounded-xl bg-teal-700 p-2 text-white"><Activity /></span><div><h1 className="text-xl font-semibold">Vedana Core</h1><p className="text-sm text-slate-500">Samodzielny demonstrator dokumentacji przebiegu wizyty</p></div></div>{!standalone && <Link href="/"><Button variant="ghost"><ArrowLeft /> Scheduler</Button></Link>}</div></header>
    <div className="mx-auto max-w-5xl space-y-5 px-4 py-8"><div className="flex justify-end"><TestCaseLoader onLoad={loadTest} /></div><PatientSelector patients={patients} selected={patient} onSelect={setPatient} onAdd={p => { setPatients(old => [...new Set([...old, p])]); setPatient(p); }} />
      <ListeningPanel transcript={transcript} onTranscript={setTranscript} onFinish={finish} />
      {events.length > 0 && <><SessionTimeline events={events} onChange={e => { setEvents(e); setAnalysis(null); }} /><div className="flex justify-end"><Button size="lg" className="bg-teal-700 hover:bg-teal-800" onClick={() => setAnalysis(generateAnalysis(events))}>Analizuj wizytę</Button></div></>}
      {analysis && <VisitAnalysis analysis={analysis} />}</div></main>;
}
