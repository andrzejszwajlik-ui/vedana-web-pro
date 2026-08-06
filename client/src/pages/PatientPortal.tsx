import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Calendar, Clock, User } from "lucide-react";
import { useLocation } from "wouter";

export default function PatientPortalPage() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"welcome" | "booking">("welcome");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">Vedana Scheduler</h1>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/")}
            className="text-slate-600 hover:text-slate-900"
          >
            Wróć
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {step === "welcome" ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-slate-900">
                Zarezerwuj wizytę online
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Szybko i łatwo umów się na wizytę u naszych specjalistów. Wybierz dogodny termin z dostępnych slotów.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Elastyczne terminy</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Wybierz termin spośród dostępnych slotów
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Bez rejestracji</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Zarezerwuj wizytę bez konta w systemie
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Potwierdzenie</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Otrzymaj potwierdzenie na email
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center pt-8">
              <Button 
                size="lg"
                onClick={() => setStep("booking")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Zarezerwuj wizytę
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <Button 
                variant="ghost" 
                onClick={() => setStep("welcome")}
                className="text-slate-600"
              >
                ← Wróć
              </Button>
            </div>
            <BookingForm onSuccess={() => setStep("welcome")} />
          </div>
        )}
      </main>
    </div>
  );
}

function BookingForm({ onSuccess }: { onSuccess: () => void }) {
  return (
    <Card className="p-8 border-slate-200 max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-slate-900 mb-6">Formularz rezerwacji</h3>
      <div className="space-y-4">
        <p className="text-slate-600">Formularz rezerwacji będzie zaimplementowany w następnym kroku...</p>
      </div>
    </Card>
  );
}
