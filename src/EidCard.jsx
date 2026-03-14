import React from "react";
import { IconMoonStars,  IconStarFilled } from "@tabler/icons-react";

const EidCard = () => {
  return (
    <div className="group relative flex flex-col items-center justify-center text-center p-12 rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(16,185,129,0.2)]">
      
      
      {/* Subtle background stars */}
      <IconStarFilled size={10} className="absolute top-24 left-20 text-white/20 animate-ping z-0" />
      <IconStarFilled size={14} className="absolute bottom-32 right-20 text-white/20 animate-ping delay-500 z-0" />

      {/* Card Content (z-10 ensures it stays above the background layers) */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Floating Moon Icon */}
        <div className="w-24 h-24 mb-8 rounded-full bg-gradient-to-tr from-emerald-900/50 to-slate-800 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)] group-hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-all duration-500 transform group-hover:scale-110">
          <IconMoonStars
            size={48}
            stroke={1.2}
            className="text-emerald-400 animate-[pulse_3s_ease-in-out_infinite]"
          />
        </div>

        {/* Luxury Gold Gradient Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 drop-shadow-sm">
          Eid Mubarak
        </h1>

        {/* Refined Message */}
        <p className="text-slate-300 max-w-sm text-sm md:text-base leading-relaxed font-light mb-8">
           May this Eid bring peace, happiness, and prosperity to you and your
        family. May Allah accept your prayers and fasting.
        </p>

        {/* Elegant Divider */}
        <div className="flex items-center w-full max-w-[200px] gap-3 mb-8 opacity-70">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent to-amber-500/50"></div>
          <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,1)]"></div>
          <div className="h-[1px] w-full bg-gradient-to-l from-transparent to-amber-500/50"></div>
        </div>

        {/* Arabic Sign-off */}
        <div className="bg-emerald-950/40 border border-emerald-500/20 px-6 py-2.5 rounded-2xl backdrop-blur-md transform group-hover:-translate-y-1 transition-transform duration-500">
          <p className="text-emerald-400/90 text-xs font-semibold tracking-widest ">
            Thank you for using Ramadan 2026 web app. Will back 2027 again.
          </p>
        </div>
      </div>
      
    </div>
  );
};

export default EidCard;