import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/music/background.mp3");
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    setHasInteracted(true);

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.button
      data-testid="button-music-toggle"
      onClick={toggleMusic}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-10 h-10 rounded-md cursor-pointer"
      style={{
        background: "rgba(5, 20, 10, 0.8)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(0, 255, 100, 0.15)",
        color: isPlaying ? "rgba(0, 255, 100, 0.9)" : "rgba(0, 255, 100, 0.4)",
      }}
      whileHover={{
        scale: 1.05,
        borderColor: "rgba(0, 255, 100, 0.4)",
        boxShadow: "0 0 20px rgba(0, 255, 100, 0.15)",
      }}
      whileTap={{ scale: 0.97 }}
      title={isPlaying ? "Mute" : "Play music"}
    >
      <AnimatePresence mode="wait">
        {isPlaying ? (
          <motion.div
            key="playing"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <Volume2 className="w-4 h-4" />
          </motion.div>
        ) : (
          <motion.div
            key="muted"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <VolumeX className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>

      {!hasInteracted && (
        <motion.span
          className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
          style={{ backgroundColor: "rgba(0, 255, 100, 0.8)" }}
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}
