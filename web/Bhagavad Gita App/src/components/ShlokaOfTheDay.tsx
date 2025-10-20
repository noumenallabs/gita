import { Card } from "./ui/card";
import { Sparkles, Calendar, RefreshCw } from "lucide-react";
import { shlokas } from "../data/gita-data";
import { ShlokaCard } from "./ShlokaCard";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";

interface ShlokaOfTheDayProps {
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
}

export function ShlokaOfTheDay({ favorites, onToggleFavorite }: ShlokaOfTheDayProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Get deterministic shloka based on current date
  const dailyShloka = useMemo(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    const index = dayOfYear % shlokas.length;
    return shlokas[index];
  }, []);

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Daily Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 border-0 shadow-2xl overflow-hidden">
          <div className="p-6 relative">
            {/* Decorative background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white">Shloka of the Day</h2>
                    <p className="text-orange-100 text-sm">Daily spiritual wisdom</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRefresh}
                  className="text-white hover:bg-white/20"
                >
                  <RefreshCw className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`} />
                </Button>
              </div>

              <div className="flex items-center gap-2 text-white/90">
                <Calendar className="w-4 h-4" />
                <p className="text-sm">{formattedDate}</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Shloka Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <ShlokaCard
          shloka={dailyShloka}
          isFavorite={favorites.has(dailyShloka.id)}
          onToggleFavorite={onToggleFavorite}
        />
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-900">
          <p className="text-sm text-center text-muted-foreground">
            A new shloka is selected each day to guide your spiritual journey. Come back tomorrow for more wisdom from the Bhagavad Gita.
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
