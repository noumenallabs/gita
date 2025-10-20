import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Heart, ChevronDown } from "lucide-react";
import { Shloka } from "../data/gita-data";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "./ui/sheet";

interface ShlokaCardProps {
  shloka: Shloka;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export function ShlokaCard({ shloka, isFavorite, onToggleFavorite }: ShlokaCardProps) {
  const [selectedTranslation, setSelectedTranslation] = useState<"english" | "wordByWord" | "commentary">("english");
  const [showSanskrit, setShowSanskrit] = useState(true);

  const getTranslationText = () => {
    switch (selectedTranslation) {
      case "english":
        return shloka.translations.english;
      case "wordByWord":
        return shloka.translations.wordByWord;
      case "commentary":
        return shloka.translations.commentary;
    }
  };

  const translationLabels = {
    english: "English Translation",
    wordByWord: "Word by Word",
    commentary: "Commentary"
  };

  return (
    <Card className="overflow-hidden bg-white dark:bg-gray-900 shadow-xl border-0">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">{shloka.chapter}.{shloka.verse}</span>
          </div>
          <div className="text-white">
            <p className="text-sm">Chapter {shloka.chapter}, Verse {shloka.verse}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onToggleFavorite(shloka.id)}
          className="shrink-0 hover:bg-white/20"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? "fill-white text-white" : "text-white"
            }`}
          />
        </Button>
      </div>

      {/* Sanskrit section - collapsible */}
      <div className="px-4 pt-4">
        <button
          onClick={() => setShowSanskrit(!showSanskrit)}
          className="w-full flex items-center justify-between py-2 text-left"
        >
          <span className="text-sm text-orange-600 dark:text-orange-500">
            Sanskrit & Transliteration
          </span>
          <ChevronDown
            className={`w-4 h-4 text-orange-600 dark:text-orange-500 transition-transform ${
              showSanskrit ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {showSanskrit && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pb-4">
                <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl">
                  <p className="text-center leading-relaxed">{shloka.sanskrit}</p>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl">
                  <p className="text-center italic text-sm">{shloka.transliteration}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Translation section */}
      <div className="px-4 pb-4">
        <Sheet>
          <SheetTrigger asChild>
            <button className="w-full mb-3 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-between">
              <span className="text-sm">{translationLabels[selectedTranslation]}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl">
            <SheetHeader>
              <SheetTitle>Select Translation</SheetTitle>
              <SheetDescription>
                Choose how you want to read this shloka
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-2 mt-6">
              {(["english", "wordByWord", "commentary"] as const).map((type) => (
                <Button
                  key={type}
                  variant={selectedTranslation === type ? "default" : "outline"}
                  className="justify-start h-auto py-3"
                  onClick={() => setSelectedTranslation(type)}
                >
                  <div className="text-left">
                    <p>{translationLabels[type]}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {type === "english" && "Complete verse translation"}
                      {type === "wordByWord" && "Detailed word meanings"}
                      {type === "commentary" && "In-depth explanation"}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="leading-relaxed">{getTranslationText()}</p>
        </div>
      </div>
    </Card>
  );
}
