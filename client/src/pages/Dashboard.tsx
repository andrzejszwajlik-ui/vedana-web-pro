import { useAuth } from "@/_core/hooks/useAuth";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CalendarView from "@/components/scheduler/CalendarView";
import StaffManagement from "@/components/scheduler/StaffManagement";
import AppointmentsList from "@/components/scheduler/AppointmentsList";
import { Calendar, Users, Clock } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("calendar");

  if (!user) {
    return null;
  }

  const isReceptionist = user.role === "admin" || (user as any).specialization === "receptionist";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-slate-200 pb-6">
          <h1 className="text-3xl font-bold text-slate-900">Vedana Scheduler</h1>
          <p className="text-slate-600 mt-2">Zarządzaj wizytami pacjentów i dostępnością personelu</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 rounded-lg">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Kalendarz</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Wizyty</span>
            </TabsTrigger>
            {isReceptionist && (
              <TabsTrigger value="staff" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Personel</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="calendar" className="mt-6">
            <CalendarView />
          </TabsContent>

          <TabsContent value="appointments" className="mt-6">
            <AppointmentsList />
          </TabsContent>

          {isReceptionist && (
            <TabsContent value="staff" className="mt-6">
              <StaffManagement />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
