"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Play, X } from "lucide-react"

interface VideoTutorialOverlayProps {
  isVisible: boolean
  onClose: () => void
  onPlayButtonVisible: boolean // Indicates if the video's play button is visible
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 15, stiffness: 100 },
  },
}

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", damping: 15, stiffness: 100, delay: 0.4 },
  },
}

export function VideoTutorialOverlay({ isVisible, onClose, onPlayButtonVisible }: VideoTutorialOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible &&
        onPlayButtonVisible && ( // Only show if play button is also visible
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[65] flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          >
            <motion.div
              variants={itemVariants}
              className="w-full max-w-xs md:max-w-[300px] p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 text-center flex flex-col items-center relative"
            >
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-300 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-[#E469B3] to-[#D55AA4] flex items-center justify-center shadow-lg shadow-[#E469B3]/30">
                <Play className="h-10 w-10 text-white" fill="white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">🔥 Reels 🔥</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Con la Versión PRO puedes ver videos cortos de las maduritas más sexys. Pulsa reproducir para ver.
              </p>
            </motion.div>

            <motion.div variants={buttonVariants} className="mt-10">
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-[#E469B3] to-[#D55AA4] hover:from-[#D55AA4] hover:to-[#C44B95] text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-[#E469B3]/20 hover:shadow-[#E469B3]/40 transition-all duration-300"
              >
                Entendido
              </Button>
            </motion.div>
          </motion.div>
        )}
    </AnimatePresence>
  )
}
