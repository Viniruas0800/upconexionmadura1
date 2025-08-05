"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Phone } from "lucide-react"

interface CallTutorialOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export default function CallTutorialOverlay({ isOpen, onClose }: CallTutorialOverlayProps) {
  if (!isOpen) {
    return null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Blurred dark overlay - sits above chat content but below tutorial */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40"
            style={{
              top: "76px", // Start below the top bar (adjust based on your header height)
              backdropFilter: "blur(4px)",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            }}
          />

          {/* Tutorial popup - sits above the overlay */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-20 right-4 z-50 w-72"
          >
            <div
              className="relative backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-2xl text-white p-6"
              style={{ backgroundColor: "rgba(31, 30, 29, 0.95)" }}
            >
              {/* Arrow pointing up to the button */}
              <div
                className="absolute w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8"
                style={{
                  top: "-8px",
                  right: "28px", // Position arrow to point to the call icon
                  borderBottomColor: "rgba(31, 30, 29, 0.95)",
                }}
              />

              {/* Icon with glow effect */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute inset-0 w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full blur-md opacity-60 animate-pulse"></div>
                  {/* Main icon */}
                  <div className="relative w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                    <Phone className="w-8 h-8 text-white fill-white" />
                  </div>
                </div>
              </div>

              {/* Title with phone emojis */}
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold flex items-center justify-center gap-2">
                  <span>📞</span>
                  <span>Llamadas</span>
                  <span>📞</span>
                </h3>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-300 text-center leading-relaxed">
                Con la Versión PRO puedes hacer llamadas calientes 😈 en el chat ¡e incluso recibir pago por ello!
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
