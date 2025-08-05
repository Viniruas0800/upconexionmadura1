"use client"
import { motion } from "framer-motion"
import { Crown } from "lucide-react"

interface ProVersionPopupProps {
  onUnlock: () => void
}

// Pro Version Popup Component - Matching the reference image exactly
export default function ProVersionPopup({ onUnlock }: ProVersionPopupProps) {
  const handleUnlock = () => {
    onUnlock()
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative w-full max-w-sm mx-auto"
    >
      {/* Main popup container with exact styling from reference image */}
      <div className="relative bg-[#02000b] rounded-2xl p-6 border-2 border-yellow-500 shadow-2xl">
        {/* Crown icon at top with pulsing wave animation */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg pro-popup-crown pro-popup-glow">
            <Crown className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Title - exact styling from reference */}
        <h2 className="text-center text-2xl font-bold text-yellow-500 mb-4">Conexión Madura PRO</h2>

        {/* Description text - exact styling from reference */}
        <p className="text-center text-gray-300 mb-6 leading-relaxed">
          Tu prueba de la Versión PRO ha terminado. Toca el botón de abajo para desbloquear la Versión PRO.
        </p>

        {/* Unlock button with pulsing wave effect - exact styling from reference */}
        <button
          onClick={handleUnlock}
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold py-4 px-6 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden pro-popup-button"
        >
          <Crown className="w-5 h-5 mr-2" />
          Desbloquear la versión PRO
        </button>
      </div>
    </motion.div>
  )
}
