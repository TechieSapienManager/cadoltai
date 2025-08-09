import React from 'react';

export const AbstractBackground: React.FC = () => {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
      {/* Soft gradient glow layers */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-60"
           style={{
             background: 'radial-gradient(closest-side, rgba(168,85,247,0.35), rgba(168,85,247,0))'
           }}
      />
      <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full blur-3xl opacity-60"
           style={{
             background: 'radial-gradient(closest-side, rgba(236,72,153,0.35), rgba(236,72,153,0))'
           }}
      />

      {/* Subtle 3D abstract shapes */}
      <div className="absolute left-1/4 top-1/3 h-40 w-40 rotate-12 rounded-3xl blur-2xl opacity-30"
           style={{
             background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(168,85,247,0.25))',
             boxShadow: '0 20px 60px rgba(99,102,241,0.25)'
           }}
      />
      <div className="absolute right-1/5 top-16 h-28 w-28 -rotate-6 rounded-full blur-xl opacity-30"
           style={{
             background: 'linear-gradient(135deg, rgba(236,72,153,0.25), rgba(59,130,246,0.2))',
             boxShadow: '0 10px 40px rgba(236,72,153,0.25)'
           }}
      />
    </div>
  );
};
