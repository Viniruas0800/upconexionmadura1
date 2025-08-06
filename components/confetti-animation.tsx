"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ConfettiAnimationProps {
  onComplete: () => void
}

interface ConfettiPiece {
  id: number
  x: number
  y: number
  color: string
  size: number
  rotation: number
  delay: number
}

export function ConfettiAnimation({ onComplete }: ConfettiAnimationProps) {
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    // Generate confetti pieces
    const pieces: ConfettiPiece[] = []
    const colors = ["#E469B3", "#D55AA4", "#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"]

    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        x: Math.random() * 100, // percentage
        y: -10, // start above screen
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4, // 4-12px
        rotation: Math.random() * 360,
        delay: Math.random() * 1000, // 0-1s delay
      })
    }

    setConfettiPieces(pieces)

    // Complete animation after 3 seconds
    const timer = setTimeout(() => {
      onComplete()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {confettiPieces.map((piece) => (
          <motion.div
            key={piece.id}
            className="absolute"
            style={{
              left: `${piece.x}%`,
              width: `${piece.size}px`,
              height: `${piece.size}px`,
              backgroundColor: piece.color,
              borderRadius: piece.size % 2 === 0 ? "50%" : "0%",
            }}
            initial={{
              y: piece.y,
              rotate: piece.rotation,
              opacity: 1,
            }}
            animate={{
              y: window.innerHeight + 50,
              rotate: piece.rotation + 720,
              opacity: 0,
            }}
            transition={{
              duration: 2.5,
              delay: piece.delay / 1000,
              ease: "easeOut",
            }}
            exit={{ opacity: 0 }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
