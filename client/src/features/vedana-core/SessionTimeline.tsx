import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { SessionEvent } from "./types";
import { SessionEventCard } from "./SessionEventCard";
import { updateEvent } from "./core";

export function SessionTimeline({ events, onChange }: { events: SessionEvent[]; onChange: (e: SessionEvent[]) => void }) {
  const add = () => onChange([...events, { id: crypto.randomUUID(), timestamp: new Date().toISOString(), type: "UNKNOWN", originalText: "", editedText: "", confirmed: false, order: events.length }]);
  const remove = (id: string) => onChange(events.filter(e => e.id !== id).map((e, order) => ({ ...e, order })));
  return <section className="rounded-2xl border bg-white p-5 shadow-sm"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">3. Oś zdarzeń</h2><p className="mt-1 text-sm text-slate-600">Sprawdź, popraw i zatwierdź zdarzenia przed analizą.</p></div><Button variant="outline" onClick={add}><Plus /> Dodaj zdarzenie</Button></div>
    <div className="space-y-3">{events.map(event => <SessionEventCard key={event.id} event={event} onChange={patch => onChange(updateEvent(events, event.id, patch))} onDelete={() => remove(event.id)} />)}</div>
  </section>;
}
