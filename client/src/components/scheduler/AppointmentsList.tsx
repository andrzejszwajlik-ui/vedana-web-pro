import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Clock, User } from "lucide-react";
import { useState } from "react";

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Wizyty</h2>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nowa wizyta
        </Button>
      </div>

      {/* Appointments Table */}
      <Card className="border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Pacjent</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Terapeuta</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Data i godzina</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Clock className="w-8 h-8 text-slate-300" />
                      <p className="text-slate-600">Brak wizyt</p>
                    </div>
                  </td>
                </tr>
              ) : (
                appointments.map((apt: any) => (
                  <tr key={apt.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-900">{apt.patientName}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{apt.therapistName}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{apt.dateTime}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
                        Edytuj
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
