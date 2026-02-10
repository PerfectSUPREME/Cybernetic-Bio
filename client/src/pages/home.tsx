import { MatrixRain } from "@/components/matrix-rain";
import { BioCard } from "@/components/bio-card";
import { MusicPlayer } from "@/components/music-player";
import { motion } from "framer-motion";
import { SiGithub, SiDiscord, SiX } from "react-icons/si";

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    url: "https://github.com/PerfectSUPREME",
    icon: <SiGithub className="w-4 h-4" />,
  },
  {
    label: "Discord",
    url: "https://discord.com",
    icon: <SiDiscord className="w-4 h-4" />,
  },
  {
    label: "Twitter",
    url: "https://twitter.com",
    icon: <SiX className="w-3.5 h-3.5" />,
  },
];

export default function Home() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" data-testid="page-home">
      <MatrixRain />

      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, transparent 0%, rgba(2, 10, 5, 0.4) 70%, rgba(2, 10, 5, 0.8) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          <BioCard
            name="Your Name"
            description="Developer / Creator / Hacker. Building cool things on the internet. Welcome to my digital space."
            avatarFallback="YN"
            links={SOCIAL_LINKS}
          />
        </motion.div>
      </div>

      <MusicPlayer />

      <div
        className="fixed bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          zIndex: 5,
          background: "linear-gradient(to top, rgba(2, 10, 5, 0.6), transparent)",
        }}
      />
    </div>
  );
}
