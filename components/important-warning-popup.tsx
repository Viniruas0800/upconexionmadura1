"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ImportantWarningPopupProps {
  isOpen: boolean
  onClose: () => void
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

const popupVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25, duration: 0.4 },
  },
  exit: { opacity: 0, scale: 0.9, y: 10, transition: { duration: 0.3 } },
}

const iconVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 400, damping: 20, delay: 0.2 },
  },
}

export default function ImportantWarningPopup({ isOpen, onClose }: ImportantWarningPopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[300] p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            variants={popupVariants}
            className="relative bg-[#2A2A2A] rounded-2xl shadow-2xl w-full max-w-sm border border-red-500/20 overflow-hidden"
            style={{
              boxShadow: "0 0 15px rgba(239, 68, 68, 0.08), 0 10px 40px rgba(0, 0, 0, 0.4)",
            }}
          >
            {/* Subtle glow effect around the border */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/3 via-transparent to-red-500/3 rounded-2xl pointer-events-none" />

            <div className="relative z-10 p-6 pt-8 text-center">
              {/* Warning Icon with subtle glow */}
              <motion.div
                variants={iconVariants}
                className="mx-auto mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-red-500/8 relative"
                style={{
                  boxShadow: "0 0 12px rgba(239, 68, 68, 0.15)",
                }}
              >
                {/* Icon glow background */}
                <div className="absolute inset-0 bg-red-500/10 rounded-full blur-md" />
                <AlertTriangle
                  className="relative z-10 h-8 w-8 text-red-500"
                  strokeWidth={2}
                  style={{
                    filter: "drop-shadow(0 0 4px rgba(248, 113, 113, 0.2))",
                  }}
                />
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="text-2xl font-bold text-white mb-4"
              >
                ¡Importante!
              </motion.h2>

              {/* Warning Text */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="text-neutral-200 text-sm sm:text-base leading-relaxed mb-8 px-2"
              >
                NO cierres esta página ni hagas clic en el botón de regresar. Esto puede{" "}
                <span
                  className="font-semibold text-red-400"
                  style={{
                    textShadow: "0 0 4px rgba(248, 113, 113, 0.15)",
                  }}
                >
                  causar problemas con tu pedido
                </span>
                .
              </motion.p>

              {/* Understood Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <Button
                  onClick={onClose}
                  className="w-full font-bold text-base py-3 h-auto rounded-xl text-white
                             bg-gradient-to-r from-red-500 to-red-600
                             hover:from-red-600 hover:to-red-700
                             focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#2A2A2A] focus:ring-red-500
                             shadow-lg hover:shadow-red-500/20
                             transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-97"
                  style={{
                    boxShadow: "0 4px 15px rgba(239, 68, 68, 0.15), 0 0 12px rgba(239, 68, 68, 0.06)",
                  }}
                >
                  Entendido
                </Button>
              </motion.div>
            </div>

            {/* Additional subtle border glow */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(239, 68, 68, 0.06) 0%, transparent 50%, rgba(239, 68, 68, 0.06) 100%)",
                padding: "1px",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "xor",
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
