"use client";
import { motion } from "framer-motion";

export default function Loading() {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-t from-black to-black/90 text-white">
            <motion.img
                src="/Avatar.png"
                alt="Loading"
                className="w-12 h-12 rounded-full"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            />

            <motion.p
                className="mt-4 text-lg font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
                Ruko zara, sabar kro ...
            </motion.p>
        </div>
    );
}
