"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Heart, X } from "lucide-react"

interface RefinedTutorialOverlayProps {
  isVisible: boolean
  onClose: () => void
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

export function RefinedTutorialOverlay({ isVisible, onClose }: RefinedTutorialOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm p-4"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
            {/* Reject Card */}
            <motion.div
              variants={itemVariants}
              className="w-full max-w-xs md:max-w-[240px] p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 text-center flex flex-col items-center"
            >
              <div className="mb-4 h-20 w-20 rounded-full bg-white/10 border-2 border-white/20 backdrop-blur-md flex items-center justify-center">
                <X className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Saltar Perfiles</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Toca la X para saltar al siguiente perfil sin interacción.
              </p>
            </motion.div>

            {/* Like Card */}
            <motion.div
              variants={itemVariants}
              className="w-full max-w-xs md:max-w-[240px] p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 text-center flex flex-col items-center"
            >
              <div className="mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
                <Heart className="h-10 w-10 text-white" fill="white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Dale Like y Gana</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Toca el corazón para dar like a un perfil y recibir recompensas instantáneas.
              </p>
            </motion.div>
          </div>

          {/* CTA Button */}
          <motion.div variants={buttonVariants} className="mt-10">
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transition-all duration-300"
            >
              Entendido, empezar a explorar
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
