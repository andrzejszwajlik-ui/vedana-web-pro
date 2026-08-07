import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, Trash2 } from "lucide-react";
import { EVENT_TYPES, type SessionEvent, type SessionEventType } from "./types";

export function SessionEventCard({ event, onChange, onDelete }: { event: SessionEvent; onChange: (patch: Partial<SessionEvent>) => void; onDelete: () => void }) {
  return <article className={`rounded-xl border p-4 ${event.confirmed ? "border-teal-200 bg-teal-50/60" : "bg-white"}`}>
    <div className="mb-3 flex flex-wrap items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">{event.order + 1}</span>
      <select aria-label="Typ zdarzenia" value={event.type} onChange={e => onChange({ type: e.target.value as SessionEventType })} className="h-9 flex-1 rounded-md border bg-white px-2 text-xs font-semibold text-slate-700">{EVENT_TYPES.map(type => <option key={type}>{type}</option>)}</select>
      <time className="text-xs text-slate-400">{new Date(event.timestamp).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}</time>
    </div>
    <Textarea value={event.editedText} onChange={e => onChange({ editedText: e.target.value })} aria-label="Treść zdarzenia" />
    <div className="mt-3 flex justify-end gap-2"><Button size="sm" variant="ghost" onClick={onDelete}><Trash2 /> Usuń</Button><Button size="sm" variant={event.confirmed ? "outline" : "default"} onClick={() => onChange({ confirmed: !event.confirmed })}><Check /> {event.confirmed ? "Zatwierdzone" : "Zatwierdź"}</Button></div>
  </article>;
}
