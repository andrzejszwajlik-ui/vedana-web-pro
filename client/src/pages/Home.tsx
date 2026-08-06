import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Users, Clock, Zap, Shield, Bell } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">Vedana Scheduler</h1>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-slate-600">{user?.name}</span>
                <Button 
                  onClick={() => setLocation("/dashboard")}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Panel
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => window.location.href = getLoginUrl()}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Zaloguj się
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-5xl font-bold text-slate-900 leading-tight">
              Elegancki system rezerwacji wizyt dla klinik medycznych
            </h2>
            <p className="text-xl text-slate-600">
              Vedana Scheduler to nowoczesne rozwiązanie do zarządzania wizytami pacjentów, personelem i dostępnością. Idealny dla fizjoterapeutów, lekarzy i osteopatów.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg"
                onClick={() => setLocation("/booking")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Zarezerwuj wizytę
              </Button>
              {!isAuthenticated && (
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => window.location.href = getLoginUrl()}
                  className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                >
                  Zaloguj się jako pracownik
                </Button>
              )}
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-8 h-96 flex items-center justify-center">
            <div className="text-center">
              <Calendar className="w-24 h-24 text-indigo-600 mx-auto mb-4 opacity-80" />
              <p className="text-slate-600 font-medium">Interfejs kalendarza</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-slate-900">Funkcjonalności</h3>
            <p className="text-slate-600 mt-2">Wszystko czego potrzebujesz do zarządzania wizytami</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all">
              <div className="p-3 bg-indigo-100 rounded-lg w-fit mb-4">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Widoki kalendarza</h4>
              <p className="text-slate-600">Dzienne, tygodniowe i miesięczne widoki dla pełnej kontroli nad harmonogramem</p>
            </Card>

            <Card className="p-8 border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all">
              <div className="p-3 bg-purple-100 rounded-lg w-fit mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Zarządzanie personelem</h4>
              <p className="text-slate-600">Osobne grafiki dla lekarzy, fizjoterapeutów, osteopatów i recepcji</p>
            </Card>

            <Card className="p-8 border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all">
              <div className="p-3 bg-emerald-100 rounded-lg w-fit mb-4">
                <Clock className="w-6 h-6 text-emerald-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Konfiguracja slotów</h4>
              <p className="text-slate-600">Elastyczne ustawienia czasu trwania wizyt i godzin pracy</p>
            </Card>

            <Card className="p-8 border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all">
              <div className="p-3 bg-rose-100 rounded-lg w-fit mb-4">
                <Zap className="w-6 h-6 text-rose-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Rejestracja online</h4>
              <p className="text-slate-600">Pacjenci mogą rezerwować wizyty bez logowania w systemie</p>
            </Card>

            <Card className="p-8 border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all">
              <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Notyfikacje</h4>
              <p className="text-slate-600">Email i powiadomienia in-app o potwierdzeniu i przypomnieniach</p>
            </Card>

            <Card className="p-8 border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all">
              <div className="p-3 bg-amber-100 rounded-lg w-fit mb-4">
                <Shield className="w-6 h-6 text-amber-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Bezpieczeństwo</h4>
              <p className="text-slate-600">Kontrola dostępu oparta na rolach i bezpieczne przechowywanie danych</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Gotów do zarządzania wizytami?</h3>
          <p className="text-indigo-100 mb-8 text-lg">
            Zaloguj się jako pracownik lub zarezerwuj wizytę jako pacjent
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => setLocation("/booking")}
              className="bg-white text-indigo-600 hover:bg-indigo-50"
            >
              Zarezerwuj wizytę
            </Button>
            {!isAuthenticated && (
              <Button 
                size="lg"
                variant="outline"
                onClick={() => window.location.href = getLoginUrl()}
                className="border-white text-white hover:bg-indigo-700"
              >
                Zaloguj się
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Vedana Scheduler</h4>
              <p className="text-sm">Nowoczesny system rezerwacji wizyt dla klinik medycznych</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Produkty</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Scheduler</a></li>
                <li><a href="#" className="hover:text-white transition">Clinical Core</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Wsparcie</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Dokumentacja</a></li>
                <li><a href="#" className="hover:text-white transition">Kontakt</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Firma</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">O nas</a></li>
                <li><a href="#" className="hover:text-white transition">Polityka prywatności</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2026 Vedana. Wszystkie prawa zastrzeżone.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
