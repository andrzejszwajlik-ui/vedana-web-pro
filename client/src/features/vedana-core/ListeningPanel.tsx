import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";
import { TranscriptEditor } from "./TranscriptEditor";

interface Recognition { lang: string; continuous: boolean; interimResults: boolean; onresult: ((e: { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> }) => void) | null; onend: (() => void) | null; start(): void; stop(): void }
type RecognitionCtor = new () => Recognition;

export function ListeningPanel({ transcript, onTranscript, onFinish }: { transcript: string; onTranscript: (v: string) => void; onFinish: () => void }) {
  const [listening, setListening] = useState(false);
  const recognition = useRef<Recognition | null>(null);
  const ctor = typeof window !== "undefined" ? ((window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor }).SpeechRecognition ?? (window as unknown as { webkitSpeechRecognition?: RecognitionCtor }).webkitSpeechRecognition) : undefined;
  const start = () => { setListening(true); if (ctor) { const r = new ctor(); r.lang = "pl-PL"; r.continuous = true; r.interimResults = false; r.onresult = e => { let addition = ""; for (let i = 0; i < e.results.length; i++) if (e.results[i].isFinal) addition += e.results[i][0].transcript + ". "; onTranscript(`${transcript} ${addition}`.trim()); }; r.onend = () => setListening(false); recognition.current = r; r.start(); } };
  const finish = () => { recognition.current?.stop(); setListening(false); onFinish(); };
  return <section className="rounded-2xl border bg-slate-50 p-5 shadow-sm">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">2. Tryb słuchania</h2><p className="mt-1 text-sm text-slate-600">{listening ? "Słuchanie trwa — zapisuj tylko przebieg wizyty." : ctor ? "Dyktowanie jest dostępne w tej przeglądarce." : "Dyktowanie niedostępne — użyj pola tekstowego."}</p></div>
      {!listening ? <Button size="lg" onClick={start} className="bg-teal-700 hover:bg-teal-800"><Mic /> Rozpocznij słuchanie</Button> : <Button size="lg" variant="destructive" onClick={finish}><Square /> Zakończ słuchanie</Button>}
    </div><TranscriptEditor value={transcript} onChange={onTranscript} />
    {!listening && transcript.trim() && <Button className="mt-4" onClick={onFinish}>Przejdź do osi zdarzeń</Button>}
  </section>;
}
