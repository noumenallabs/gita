import { GitaLogo } from "./GitaLogo";

export function AppHeader() {
  return (
    <div className="flex-shrink-0 bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 text-white px-6 pt-12 pb-6 shadow-2xl relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23ffffff' fill-opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }}
      />

      <div className="relative z-10">
        {/* Main Title with Logo */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
            <GitaLogo size={40} className="text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-white text-2xl tracking-tight mb-1">Bhagavad Gita</h1>
            <p className="text-orange-100 text-sm">
              Sacred Song of the Divine
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
