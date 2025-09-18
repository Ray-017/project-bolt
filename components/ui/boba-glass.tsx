interface BobaGlassProps {
  isHolding: boolean;
  isDragging: boolean;
  dragDirection: 'left' | 'right' | null;
  scale?: number;
}

export function BobaGlass({ isHolding, isDragging, dragDirection, scale = 1 }: BobaGlassProps) {
  return (
    <div className={`relative transition-all duration-300 transform
      ${isHolding ? 'scale-110' : 'scale-100'}
      ${isDragging ? 'scale-105' : ''}
      hover:scale-105
    `}
    style={{ transform: `scale(${scale})` }}
    >
      {/* Glow Effect */}
      <div className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-300
        ${isHolding ? 'opacity-75' : 'opacity-0'}
        ${dragDirection === 'right' ? 'bg-gradient-to-r from-pink-300 to-purple-300' : ''}
        ${dragDirection === 'left' ? 'bg-gradient-to-l from-red-300 to-orange-300' : ''}
        ${!dragDirection && isHolding ? 'bg-gradient-to-t from-pink-300 to-purple-300' : ''}
      `} />

      {/* Main Glass Container */}
      <div className="relative w-20 h-28">
        {/* Glass Body */}
        <div className="absolute inset-x-0 top-4 bottom-0 bg-gradient-to-br from-purple-100 to-pink-50 rounded-2xl backdrop-blur-sm border-2 border-white/50 shadow-lg">
          {/* Tea Level */}
          <div className="absolute inset-x-2 top-2 bottom-8 bg-gradient-to-b from-purple-300/80 to-pink-200/80 rounded-xl">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/30 rounded-xl" />
          </div>
        </div>

        {/* Lid */}
        <div className="absolute inset-x-2 top-0 h-6 bg-gradient-to-b from-purple-400 to-purple-300 rounded-t-xl">
          <div className="absolute inset-x-4 top-1 h-1 bg-white/30 rounded-full" />
        </div>

        {/* Straw */}
        <div className="absolute left-1/2 top-2 -translate-x-1/2 w-4 h-28 bg-gradient-to-b from-pink-300 to-pink-400 rounded-full transform -rotate-3">
          <div className="absolute inset-x-1 top-1 h-1/2 bg-white/30 rounded-full" />
        </div>

        {/* Boba Pearls */}
        <div className="absolute inset-x-3 bottom-2 h-6 flex justify-around items-center">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-700 to-purple-900 shadow-lg">
              <div className="w-1 h-1 rounded-full bg-white/30 translate-x-0.5 translate-y-0.5" />
            </div>
          ))}
        </div>

        {/* Direction Indicators */}
        {isDragging && (
          <>
            <div className={`absolute -left-8 top-1/2 -translate-y-1/2 transition-opacity duration-300
              ${dragDirection === 'left' ? 'opacity-100' : 'opacity-30'}`}>
              <span className="text-2xl">👋</span>
            </div>
            <div className={`absolute -right-8 top-1/2 -translate-y-1/2 transition-opacity duration-300
              ${dragDirection === 'right' ? 'opacity-100' : 'opacity-30'}`}>
              <span className="text-2xl">❤️</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
