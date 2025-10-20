import { shlokas } from "../data/gita-data";
import { ShlokaCard } from "./ShlokaCard";
import { Card } from "./ui/card";
import { Heart, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface FavoritesListProps {
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
}

export function FavoritesList({ favorites, onToggleFavorite }: FavoritesListProps) {
  const favoriteShlokas = shlokas.filter((shloka) => favorites.has(shloka.id));

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h2>Your Favorites</h2>
            <p className="text-muted-foreground">
              {favorites.size} saved shloka{favorites.size !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {favoriteShlokas.length > 0 ? (
          favoriteShlokas.map((shloka, index) => (
            <motion.div
              key={shloka.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ShlokaCard
                shloka={shloka}
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
              />
            </motion.div>
          ))
        ) : (
          <Card className="p-12 text-center bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border-0">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-4">
              Tap the heart icon on any shloka to save it here for quick access
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-full text-sm">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Start exploring the Gita</span>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
