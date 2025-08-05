"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle, Star, DollarSign } from "lucide-react"

interface SuccessPopupProps {
  onStartEarning: () => void
}

export function SuccessPopup({ onStartEarning }: SuccessPopupProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-sm rounded-2xl p-6 border border-[#22c55e]/30 shadow-2xl"
        style={{ backgroundColor: "rgba(22, 31, 44, 0.7)", backdropFilter: "blur(12px)" }}
      >
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <motion.div
            className="h-16 w-16 bg-[#22c55e] rounded-full flex items-center justify-center shadow-lg shadow-green-500/30"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <CheckCircle className="h-8 w-8 text-white" />
          </motion.div>
        </div>

        {/* Title */}
        <motion.h2
          className="text-2xl font-bold text-white text-center mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          ¡Perfil creado exitosamente!
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-gray-300 text-center mb-6 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Ya estás listo para interactuar con mujeres maduras que pagan generosamente por atención y cariño.
        </motion.p>

        {/* Benefits */}
        <motion.div
          className="space-y-3 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <div className="h-8 w-8 bg-[#22c55e]/20 rounded-full flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-[#22c55e]" />
            </div>
            <span>Gana dinero por cada interacción</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <div className="h-8 w-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <Star className="h-4 w-4 text-yellow-500" />
            </div>
            <span>Acceso premium a perfiles exclusivos</span>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <Button
              onClick={onStartEarning}
              className="w-full bg-[#22c55e] hover:bg-[#16a34a] border border-[#22c55e] hover:border-[#16a34a] text-white font-bold py-4 text-lg shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-200"
            >
              Empezar a ganar ahora mismo
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
