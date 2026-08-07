import { Button } from "@/components/ui/button";
import { FlaskConical } from "lucide-react";
export function TestCaseLoader({ onLoad }: { onLoad: () => void }) { return <Button variant="outline" onClick={onLoad}><FlaskConical /> Wczytaj przypadek testowy</Button>; }
