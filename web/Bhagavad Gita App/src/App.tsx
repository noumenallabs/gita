import { useState, useEffect } from "react";
import { AppHeader } from "./components/AppHeader";
import { ShlokaOfTheDay } from "./components/ShlokaOfTheDay";
import { BrowseChapters } from "./components/BrowseChapters";
import { SearchShlokas } from "./components/SearchShlokas";
import { FavoritesList } from "./components/FavoritesList";
import { Home, Book, Search, Heart } from "lucide-react";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";
import { motion, AnimatePresence } from "motion/react";

type Tab = "home" | "browse" | "search" | "favorites";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("gita-favorites");
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        setFavorites(new Set(parsed));
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("gita-favorites", JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
        toast.success("Removed from favorites");
      } else {
        newFavorites.add(id);
        toast.success("Added to favorites");
      }
      return newFavorites;
    });
  };

  const tabs = [
    { id: "home" as Tab, icon: Home, label: "Home" },
    { id: "browse" as Tab, icon: Book, label: "Browse" },
    { id: "search" as Tab, icon: Search, label: "Search" },
    { id: "favorites" as Tab, icon: Heart, label: "Favorites" },
  ];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden">
      <Toaster position="top-center" />

      {/* Header */}
      <AppHeader />

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="px-4 py-6"
          >
            {activeTab === "home" && (
              <ShlokaOfTheDay favorites={favorites} onToggleFavorite={toggleFavorite} />
            )}
            {activeTab === "browse" && (
              <BrowseChapters favorites={favorites} onToggleFavorite={toggleFavorite} />
            )}
            {activeTab === "search" && (
              <SearchShlokas favorites={favorites} onToggleFavorite={toggleFavorite} />
            )}
            {activeTab === "favorites" && (
              <FavoritesList favorites={favorites} onToggleFavorite={toggleFavorite} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="flex-shrink-0 fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-around px-2 py-2 safe-bottom">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-orange-100 dark:bg-orange-950/30 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon
                  className={`w-6 h-6 relative z-10 transition-colors ${
                    isActive
                      ? "text-orange-600 dark:text-orange-500"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                />
                <span
                  className={`text-xs relative z-10 transition-colors ${
                    isActive
                      ? "text-orange-600 dark:text-orange-500"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
