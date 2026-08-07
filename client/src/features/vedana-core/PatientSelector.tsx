import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PatientSelector({ patients, selected, onSelect, onAdd }: { patients: string[]; selected: string; onSelect: (p: string) => void; onAdd: (p: string) => void }) {
  const [name, setName] = useState("");
  return <section className="rounded-2xl border bg-white p-5 shadow-sm">
    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">1. Pacjent</h2>
    <div className="flex flex-wrap gap-2">{patients.map(patient => <Button key={patient} variant={selected === patient ? "default" : "outline"} onClick={() => onSelect(patient)}>{patient}</Button>)}</div>
    <form className="mt-4 flex gap-2" onSubmit={e => { e.preventDefault(); if (name.trim()) { onAdd(name.trim()); setName(""); } }}>
      <Input value={name} onChange={e => setName(e.target.value)} placeholder="Wpisz imię nowego pacjenta" aria-label="Nowy pacjent" />
      <Button type="submit" variant="outline">Dodaj</Button>
    </form>
  </section>;
}
