import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";
import { TranscriptEditor } from "./TranscriptEditor";

interface RecognitionResultLike {
  0: { transcript: string };
  isFinal: boolean;
}

interface RecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<RecognitionResultLike>;
}

interface Recognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: RecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

type RecognitionCtor = new () => Recognition;

type BrowserSpeechWindow = Window & {
  SpeechRecognition?: RecognitionCtor;
  webkitSpeechRecognition?: RecognitionCtor;
};

export function ListeningPanel({
  transcript,
  onTranscript,
  onFinish,
}: {
  transcript: string;
  onTranscript: (value: string) => void;
  onFinish: () => void;
}) {
  const [listening, setListening] = useState(false);
  const recognition = useRef<Recognition | null>(null);
  const transcriptBuffer = useRef(transcript);
  const finishRequested = useRef(false);

  const browserWindow =
    typeof window !== "undefined" ? (window as BrowserSpeechWindow) : null;
  const ctor =
    browserWindow?.SpeechRecognition ?? browserWindow?.webkitSpeechRecognition;

  useEffect(() => {
    transcriptBuffer.current = transcript;
  }, [transcript]);

  useEffect(
    () => () => {
      try {
        recognition.current?.stop();
      } catch {
        // Recognition may already be stopped by the browser.
      }
    },
    [],
  );

  const start = () => {
    if (!ctor) return;

    finishRequested.current = false;
    transcriptBuffer.current = transcript.trim();

    const instance = new ctor();
    instance.lang = "pl-PL";
    instance.continuous = true;
    instance.interimResults = false;
    instance.onresult = event => {
      let addition = "";

      for (let index = event.resultIndex; index < event.results.length; index++) {
        const result = event.results[index];
        if (result.isFinal) {
          addition += `${result[0].transcript.trim()}. `;
        }
      }

      if (!addition.trim()) return;

      transcriptBuffer.current =
        `${transcriptBuffer.current} ${addition}`.trim();
      onTranscript(transcriptBuffer.current);
    };
    instance.onend = () => {
      setListening(false);
      recognition.current = null;

      if (finishRequested.current) {
        finishRequested.current = false;
        onFinish();
      }
    };

    recognition.current = instance;

    try {
      instance.start();
      setListening(true);
    } catch {
      recognition.current = null;
      setListening(false);
    }
  };

  const finish = () => {
    const currentRecognition = recognition.current;

    if (!currentRecognition) {
      setListening(false);
      onFinish();
      return;
    }

    finishRequested.current = true;
    currentRecognition.stop();
  };

  return (
    <section className="rounded-2xl border bg-slate-50 p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            2. Tryb słuchania
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {listening
              ? "Słuchanie trwa — zapisuj tylko przebieg wizyty."
              : ctor
                ? "Dyktowanie jest dostępne w tej przeglądarce."
                : "Dyktowanie niedostępne — użyj ręcznego pola transkrypcji."}
          </p>
        </div>

        {ctor &&
          (!listening ? (
            <Button
              size="lg"
              onClick={start}
              className="bg-teal-700 hover:bg-teal-800"
            >
              <Mic /> Rozpocznij słuchanie
            </Button>
          ) : (
            <Button size="lg" variant="destructive" onClick={finish}>
              <Square /> Zakończ słuchanie
            </Button>
          ))}
      </div>

      <TranscriptEditor value={transcript} onChange={onTranscript} />

      {!listening && transcript.trim() && (
        <Button className="mt-4" onClick={onFinish}>
          Przejdź do osi zdarzeń
        </Button>
      )}
    </section>
  );
}
