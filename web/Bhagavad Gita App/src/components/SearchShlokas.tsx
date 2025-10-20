import { useState, useMemo } from "react";
import { Input } from "./ui/input";
import { Search, X, Sparkles } from "lucide-react";
import { shlokas } from "../data/gita-data";
import { ShlokaCard } from "./ShlokaCard";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { motion } from "motion/react";

interface SearchShlokasProps {
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
}

export function SearchShlokas({ favorites, onToggleFavorite }: SearchShlokasProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredShlokas = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    return shlokas.filter((shloka) => {
      return (
        shloka.transliteration.toLowerCase().includes(query) ||
        shloka.translations.english.toLowerCase().includes(query) ||
        shloka.translations.wordByWord.toLowerCase().includes(query) ||
        shloka.translations.commentary.toLowerCase().includes(query) ||
        shloka.id.includes(query)
      );
    });
  }, [searchQuery]);

  const popularSearches = ["karma", "dharma", "yoga", "soul", "action", "duty"];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-6 h-6 text-orange-600" />
          <div>
            <h2>Search Shlokas</h2>
            <p className="text-muted-foreground text-sm">
              Find wisdom across all chapters
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by keyword or verse number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12 h-14 text-base rounded-2xl border-2 focus:border-orange-500"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setSearchQuery("")}
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Popular Searches */}
        {!searchQuery && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-3">Popular searches:</p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery(term)}
                  className="rounded-full"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  {term}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {!searchQuery.trim() ? (
          <Card className="p-12 text-center bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-0">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h3 className="mb-2">Search the Gita</h3>
            <p className="text-muted-foreground">
              Enter keywords, verse numbers (e.g., "2.47"), or phrases to discover timeless wisdom
            </p>
          </Card>
        ) : filteredShlokas.length > 0 ? (
          <>
            <div className="flex items-center gap-2 px-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              <p className="text-sm text-muted-foreground">
                Found {filteredShlokas.length} shloka{filteredShlokas.length !== 1 ? "s" : ""}
              </p>
            </div>
            {filteredShlokas.map((shloka, index) => (
              <motion.div
                key={shloka.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ShlokaCard
                  shloka={shloka}
                  isFavorite={favorites.has(shloka.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              </motion.div>
            ))}
          </>
        ) : (
          <Card className="p-12 text-center bg-white dark:bg-gray-900">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2">No results found</h3>
            <p className="text-muted-foreground mb-4">
              No shlokas found matching "{searchQuery}"
            </p>
            <Button
              variant="outline"
              onClick={() => setSearchQuery("")}
              className="rounded-full"
            >
              Clear search
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
