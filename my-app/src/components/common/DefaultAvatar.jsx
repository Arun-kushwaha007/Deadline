import React from 'react';

const DefaultAvatar = ({ size = 32, className = "", name = "User" }) => {
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div
      className={`bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold shadow-xl relative overflow-hidden ${className}`}
      style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/20 animate-pulse" />

      {/* Avatar icon or initials */}
      {size >= 12 ? (
        <svg
          className="w-1/2 h-1/2 relative z-10"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      ) : (
        <span className="relative z-10 text-xs">{initials}</span>
      )}

      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shine" />
    </div>
  );
};

export default DefaultAvatar;
