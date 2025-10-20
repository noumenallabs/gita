import { useState } from "react";
import { chapters, shlokas } from "../data/gita-data";
import { Card } from "./ui/card";
import { ShlokaCard } from "./ShlokaCard";
import { ChevronRight, Book, BookOpen, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

interface BrowseChaptersProps {
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
}

// Subtle gradient variations within the orange/amber family
const getChapterGradient = (chapterNum: number) => {
  // Alternate between slightly different shades for subtle variation
  const gradients = [
    "from-orange-500 to-amber-500",
    "from-orange-600 to-amber-600",
    "from-amber-500 to-orange-500",
  ];
  return gradients[(chapterNum - 1) % gradients.length];
};

export function BrowseChapters({ favorites, onToggleFavorite }: BrowseChaptersProps) {
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChapters = chapters.filter(
    (chapter) =>
      chapter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chapter.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chapter.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedChapterData = chapters.find((c) => c.number === selectedChapter);
  const chapterShlokas = selectedChapter
    ? shlokas.filter((s) => s.chapter === selectedChapter)
    : [];

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!selectedChapter ? (
          <motion.div
            key="chapter-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Header Section */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2>Browse Chapters</h2>
                  <p className="text-muted-foreground text-sm">
                    Explore 18 chapters of wisdom
                  </p>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Book className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search chapters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl border-2"
                />
              </div>
            </div>

            {/* Chapter Grid */}
            <div className="space-y-3">
              {filteredChapters.map((chapter, index) => {
                const hasShlokas = shlokas.some((s) => s.chapter === chapter.number);
                
                return (
                  <motion.div
                    key={chapter.number}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className="overflow-hidden cursor-pointer active:scale-[0.98] transition-all hover:shadow-xl border-0 shadow-md bg-white dark:bg-gray-900"
                      onClick={() => setSelectedChapter(chapter.number)}
                    >
                      {/* Gradient Header */}
                      <div className={`h-2 bg-gradient-to-r ${getChapterGradient(chapter.number)}`} />
                      
                      <div className="p-4">
                        <div className="flex items-start gap-4">
                          {/* Chapter Number Badge */}
                          <div className={`w-14 h-14 bg-gradient-to-br ${getChapterGradient(chapter.number)} rounded-2xl flex items-center justify-center shrink-0 shadow-lg relative`}>
                            <span className="text-white text-xl">{chapter.number}</span>
                            {hasShlokas && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                <span className="text-xs text-white">✓</span>
                              </div>
                            )}
                          </div>

                          {/* Chapter Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="mb-1 line-clamp-1">{chapter.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                              {chapter.translation}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {chapter.summary}
                            </p>
                            
                            {/* Footer Info */}
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                <span className="text-xs text-muted-foreground">
                                  {chapter.verses} verses
                                </span>
                              </div>
                              {hasShlokas && (
                                <Badge variant="secondary" className="text-xs">
                                  Sample Available
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Arrow */}
                          <ChevronRight className="w-5 h-5 text-gray-400 shrink-0 mt-4" />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {filteredChapters.length === 0 && (
              <Card className="p-12 text-center bg-white dark:bg-gray-900">
                <Book className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="mb-2">No chapters found</h3>
                <p className="text-muted-foreground">
                  Try a different search term
                </p>
              </Card>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="chapter-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Chapter Header - Sticky */}
            <div className="sticky top-0 z-10 -mx-4 px-4 py-4 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedChapter(null)}
                className="mb-3 -ml-2 hover:bg-white/50 dark:hover:bg-gray-800/50"
              >
                <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
                Back to Chapters
              </Button>

              <Card className={`overflow-hidden border-0 shadow-xl bg-gradient-to-br ${getChapterGradient(selectedChapterData?.number || 1)}`}>
                {/* Decorative pattern */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0l20 20-20 20L0 20z' fill='%23ffffff'/%3E%3C/svg%3E")`,
                    backgroundSize: '20px 20px'
                  }}
                />
                
                <div className="p-6 text-white relative z-10">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-lg shrink-0">
                      <span className="text-3xl">{selectedChapterData?.number}</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-white mb-2">{selectedChapterData?.name}</h2>
                      <p className="text-white/90 text-sm">
                        {selectedChapterData?.translation}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <p className="text-sm text-white/90 leading-relaxed">
                      {selectedChapterData?.summary}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white/80 rounded-full" />
                      <span className="text-xs text-white/90">
                        {selectedChapterData?.verses} verses total
                      </span>
                    </div>
                    {chapterShlokas.length > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-300 rounded-full" />
                        <span className="text-xs text-white/90">
                          {chapterShlokas.length} sample{chapterShlokas.length !== 1 ? 's' : ''} available
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Shlokas */}
            <div className="space-y-4 pt-2">
              {chapterShlokas.length > 0 ? (
                chapterShlokas.map((shloka, index) => (
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
                ))
              ) : (
                <Card className="p-12 text-center bg-white dark:bg-gray-900">
                  <div className={`w-16 h-16 bg-gradient-to-br ${getChapterGradient(selectedChapterData?.number || 1)} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Book className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="mb-2">Coming Soon</h3>
                  <p className="text-muted-foreground mb-4">
                    Sample shlokas for this chapter will be added soon
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This chapter contains {selectedChapterData?.verses} verses in total
                  </p>
                </Card>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
