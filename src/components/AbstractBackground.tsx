import React from 'react';

export const AbstractBackground: React.FC = () => {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
      {/* Simplified gradient layers for mobile performance */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full opacity-40 hidden sm:block"
           style={{
             background: 'radial-gradient(closest-side, rgba(168,85,247,0.25), rgba(168,85,247,0))'
           }}
      />
      <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full opacity-40 hidden sm:block"
           style={{
             background: 'radial-gradient(closest-side, rgba(236,72,153,0.25), rgba(236,72,153,0))'
           }}
      />

      {/* Mobile-optimized simple shapes */}
      <div className="absolute left-1/4 top-1/3 h-20 w-20 sm:h-40 sm:w-40 rotate-12 rounded-3xl opacity-20"
           style={{
             background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))'
           }}
      />
      <div className="absolute right-1/5 top-16 h-14 w-14 sm:h-28 sm:w-28 -rotate-6 rounded-full opacity-20"
           style={{
             background: 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(59,130,246,0.1))'
           }}
      />
    </div>
  );
};
