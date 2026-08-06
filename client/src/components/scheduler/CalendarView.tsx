import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from "date-fns";
import { pl } from "date-fns/locale";

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {format(currentDate, "MMMM yyyy", { locale: pl })}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
            {(["day", "week", "month"] as const).map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode(mode)}
                className={viewMode === mode ? "bg-indigo-600 text-white" : "text-slate-600"}
              >
                {mode === "day" ? "Dzień" : mode === "week" ? "Tydzień" : "Miesiąc"}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevMonth}
              className="border-slate-200 hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentDate(new Date())}
              className="border-slate-200 hover:bg-slate-50"
            >
              <Calendar className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
              className="border-slate-200 hover:bg-slate-50"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      {viewMode === "month" && (
        <Card className="p-6 border-slate-200">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"].map((day) => (
              <div key={day} className="text-center font-semibold text-slate-600 py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((day) => (
              <div
                key={day.toISOString()}
                className={`
                  p-3 rounded-lg text-center cursor-pointer transition-all
                  ${isToday(day) ? "bg-indigo-600 text-white font-semibold" : ""}
                  ${!isSameMonth(day, currentDate) ? "text-slate-300 bg-slate-50" : "bg-slate-50 hover:bg-slate-100"}
                  ${isSameMonth(day, currentDate) && !isToday(day) ? "text-slate-900" : ""}
                `}
              >
                {format(day, "d")}
              </div>
            ))}
          </div>
        </Card>
      )}

      {viewMode === "week" && (
        <Card className="p-6 border-slate-200">
          <p className="text-slate-600">Widok tygodniowy - wkrótce dostępny</p>
        </Card>
      )}

      {viewMode === "day" && (
        <Card className="p-6 border-slate-200">
          <p className="text-slate-600">Widok dzienny - wkrótce dostępny</p>
        </Card>
      )}

      {/* Appointments List */}
      <Card className="p-6 border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Wizyty</h3>
        <p className="text-slate-600">Lista wizyt będzie wyświetlana tutaj</p>
      </Card>
    </div>
  );
}
