import { useRef, useState, useCallback, useEffect, type ReactNode } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SocialLink {
  label: string;
  url: string;
  icon: ReactNode;
}

interface BioCardProps {
  name: string;
  description: string;
  avatarUrl?: string;
  avatarFallback: string;
  links?: SocialLink[];
}

export function BioCard({ name, description, avatarUrl, avatarFallback, links }: BioCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 20 });
  const springY = useSpring(y, { stiffness: 150, damping: 20 });
  const springRotateX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 150, damping: 20 });

  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const maxDist = 400;
    const influence = Math.max(0, 1 - dist / maxDist);

    const moveX = (dx / maxDist) * 12 * influence;
    const moveY = (dy / maxDist) * 12 * influence;

    x.set(moveX);
    y.set(moveY);
    rotateY.set((dx / rect.width) * 8 * influence);
    rotateX.set((-dy / rect.height) * 8 * influence);

    const glowX = ((e.clientX - rect.left) / rect.width) * 100;
    const glowY = ((e.clientY - rect.top) / rect.height) * 100;
    setGlowPos({ x: glowX, y: glowY });

    setIsHovered(dist < maxDist);
  }, [x, y, rotateX, rotateY]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    rotateX.set(0);
    rotateY.set(0);
    setIsHovered(false);
  }, [x, y, rotateX, rotateY]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <motion.div
      ref={cardRef}
      data-testid="card-bio"
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY,
        rotateX: springRotateX,
        rotateY: springRotateY,
        perspective: 1000,
      }}
      className="relative w-[340px] max-w-[90vw]"
    >
      <div
        className="absolute -inset-[1px] rounded-md opacity-0 transition-opacity duration-500"
        style={{
          opacity: isHovered ? 0.7 : 0,
          background: `conic-gradient(from 180deg at ${glowPos.x}% ${glowPos.y}%, 
            rgba(0,255,100,0.4) 0deg, 
            rgba(0,200,80,0.1) 90deg, 
            rgba(0,255,100,0.4) 180deg, 
            rgba(0,200,80,0.1) 270deg, 
            rgba(0,255,100,0.4) 360deg)`,
        }}
      />

      <div
        className="relative rounded-md p-6 flex flex-col items-center gap-4"
        style={{
          background: "rgba(5, 20, 10, 0.85)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(0, 255, 100, 0.08)",
        }}
      >
        <div
          className="absolute inset-0 rounded-md opacity-0 transition-opacity duration-500 pointer-events-none"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(0,255,100,0.06) 0%, transparent 60%)`,
          }}
        />

        <motion.div
          animate={{
            boxShadow: isHovered
              ? "0 0 30px rgba(0,255,100,0.3), 0 0 60px rgba(0,255,100,0.1)"
              : "0 0 15px rgba(0,255,100,0.1), 0 0 30px rgba(0,255,100,0.05)",
          }}
          transition={{ duration: 0.5 }}
          className="rounded-full"
        >
          <Avatar className="w-20 h-20 border-2 border-primary/30">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </motion.div>

        <div className="flex flex-col items-center gap-1 relative z-10">
          <motion.h1
            className="text-xl font-bold tracking-wider"
            style={{ color: "rgba(0, 255, 100, 0.9)" }}
            animate={{
              textShadow: isHovered
                ? "0 0 20px rgba(0,255,100,0.5), 0 0 40px rgba(0,255,100,0.2)"
                : "0 0 10px rgba(0,255,100,0.2)",
            }}
            transition={{ duration: 0.4 }}
          >
            {name}
          </motion.h1>

          <div
            className="w-16 h-[1px] my-1"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(0,255,100,0.4), transparent)",
            }}
          />

          <p
            className="text-sm text-center leading-relaxed px-2"
            style={{ color: "rgba(180, 220, 195, 0.7)" }}
          >
            {description}
          </p>
        </div>

        {links && links.length > 0 && (
          <div className="flex items-center gap-3 mt-1 relative z-10">
            {links.map((link) => (
              <motion.a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`link-${link.label.toLowerCase()}`}
                className="flex items-center justify-center w-9 h-9 rounded-md transition-colors duration-300"
                style={{
                  background: "rgba(0, 255, 100, 0.05)",
                  border: "1px solid rgba(0, 255, 100, 0.1)",
                  color: "rgba(0, 255, 100, 0.6)",
                }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(0, 255, 100, 0.1)",
                  borderColor: "rgba(0, 255, 100, 0.3)",
                  color: "rgba(0, 255, 100, 0.9)",
                }}
                whileTap={{ scale: 0.97 }}
                title={link.label}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 mt-1 relative z-10">
          <span
            className="inline-block w-2 h-2 rounded-full animate-pulse"
            style={{
              backgroundColor: "rgba(0, 255, 100, 0.8)",
              boxShadow: "0 0 8px rgba(0, 255, 100, 0.5)",
            }}
          />
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: "rgba(0, 255, 100, 0.5)" }}
          >
            online
          </span>
        </div>
      </div>
    </motion.div>
  );
}
