"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-linear-to-t from-black to-black/90 text-white">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-700/20 blur-[120px] rounded-full" />

      <div className="relative flex flex-col items-center">
        <motion.img
          src="/Avatar.png"
          alt="Loading"
          className="relative w-12 h-12 rounded-full ring-2 ring-purple-500/40 shadow-lg shadow-purple-600/30"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        />

        <motion.p
          className="mt-5 text-base sm:text-lg font-semibold bg-linear-to-r from-purple-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent tracking-wide"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: [0, 1, 0], y: [6, 0, 6] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          Ruko zara, sabar kro ...
        </motion.p>

        {/* Animated dots */}
        <div className="mt-3 flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-purple-400/70"
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1, 0.8] }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
                ease: "easeInOut",
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
