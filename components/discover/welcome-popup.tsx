"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Crown, X } from "lucide-react"

interface WelcomePopupProps {
  isOpen: boolean
  onClose: () => void
  onTryPro: () => void
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

const popupVariants = {
  hidden: { scale: 0.8, opacity: 0, y: 30 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 20, duration: 0.4 },
  },
  exit: { scale: 0.8, opacity: 0, y: 20, transition: { duration: 0.3 } },
}

const crownVariants = {
  hidden: { scale: 0, rotate: -180, opacity: 0 },
  visible: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 200, damping: 15, delay: 0.1 },
  },
}

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.3, duration: 0.5 },
  },
}

const textVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.4, duration: 0.5 },
  },
}

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { delay: 0.6, duration: 0.4 },
  },
}

export default function WelcomePopup({ isOpen, onClose, onTryPro }: WelcomePopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[200] p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-radial from-[#E469B3]/10 via-transparent to-transparent" />

          <motion.div
            className="relative bg-black/70 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl 
                       w-full max-w-sm text-center overflow-hidden"
            variants={popupVariants}
            style={{
              boxShadow: "0 25px 50px -12px rgba(228, 105, 179, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)",
            }}
          >
            {/* Subtle lighting overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative z-10 p-6 pt-8">
              {/* Premium Crown Icon */}
              <motion.div
                variants={crownVariants}
                initial="hidden"
                animate="visible"
                className="flex justify-center mb-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#E469B3] to-[#D55AA4] rounded-full blur-lg opacity-30 scale-110" />
                  <div className="relative w-16 h-16 bg-gradient-to-br from-[#E469B3] to-[#D55AA4] rounded-full flex items-center justify-center shadow-lg">
                    <Crown className="h-8 w-8 text-white" fill="white" />
                  </div>
                </div>
              </motion.div>

              {/* Welcome title */}
              <motion.h2
                variants={titleVariants}
                initial="hidden"
                animate="visible"
                className="text-2xl sm:text-3xl font-bold text-white mb-4"
              >
                ¡Bienvenido!
              </motion.h2>

              {/* Main content */}
              <motion.div variants={textVariants} initial="hidden" animate="visible" className="space-y-4 mb-8">
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
                  Felicitaciones por haber invertido en Conexión Madura.
                </p>

                <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
                  Nos gustaría invitarte a probar la{" "}
                  <span className="font-bold bg-gradient-to-r from-[#E469B3] via-[#D55AA4] to-[#E469B3] bg-clip-text text-transparent">
                    Versión PRO
                  </span>{" "}
                  de Conexión Madura,{" "}
                  <b>
                    totalmente <u>GRATIS.</u>
                  </b>
                </p>

                <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
                  Toca abajo y prueba la{" "}
                  <span className="font-bold bg-gradient-to-r from-[#E469B3] via-[#D55AA4] to-[#E469B3] bg-clip-text text-transparent">
                    Versión PRO
                  </span>{" "}
                  sin ningún costo.
                </p>
              </motion.div>

              {/* Pro button with pulsing animation */}
              <motion.div variants={buttonVariants} initial="hidden" animate="visible">
                <motion.div
                  animate={{
                    scale: [1, 1.02, 1],
                    boxShadow: [
                      "0 0 0 0 rgba(228, 105, 179, 0.4)",
                      "0 0 0 8px rgba(228, 105, 179, 0)",
                      "0 0 0 0 rgba(228, 105, 179, 0)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <Button
                    onClick={onTryPro}
                    className="w-full relative overflow-hidden font-bold text-base sm:text-lg py-3 h-auto rounded-xl 
                             bg-gradient-to-r from-[#E469B3] via-[#D55AA4] to-[#E469B3]
                             hover:from-[#D55AA4] hover:via-[#C44B95] hover:to-[#D55AA4]
                             text-white shadow-lg transition-all duration-300 ease-in-out 
                             transform hover:scale-105 active:scale-95"
                  >
                    {/* Metallic shine overlay */}
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                 transform -skew-x-12 translate-x-[-100%] hover:translate-x-[100%] 
                                 transition-transform duration-700 ease-in-out"
                    />

                    <div className="relative z-10 flex items-center justify-center">
                      <Crown className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                      Prueba la versión PRO
                    </div>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
