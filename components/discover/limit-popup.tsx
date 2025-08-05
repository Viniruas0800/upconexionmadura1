"use client"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Lock, X, Timer, Crown, CheckCircle } from "lucide-react"
import { useCurrency } from "@/hooks/use-currency"

interface LimitPopupProps {
  onPurchase: () => void
  onClose: () => void
}

export function LimitPopup({ onPurchase, onClose }: LimitPopupProps) {
  const [timeLeft, setTimeLeft] = useState(300)
  const [isPulsing, setIsPulsing] = useState(false)
  const { formatCurrency, formatCurrencyWithContext, isLoaded: currencyLoaded } = useCurrency()

  // Add these lines to get current page context
  const pathname = usePathname()
  const hotmartUrl = "https://pay.hotmart.com/V100751791G?off=vh1anc0h&checkoutMode=10"

  // Update the price display section to use Hotmart fixed pricing
  const displayPrice = currencyLoaded ? formatCurrencyWithContext(14.9, pathname, hotmartUrl) : "$14.90"

  const displayOriginalPrice = currencyLoaded ? formatCurrencyWithContext(97.9, pathname, hotmartUrl) : "$97.90"

  const displayInstallmentPrice = currencyLoaded ? formatCurrencyWithContext(2.82, pathname, hotmartUrl) : "$2.82"

  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-xs rounded-xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] to-[#16213e] z-0" />
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-amber-500/10 blur-xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-amber-500/10 blur-xl" />
        <div className="absolute inset-0 rounded-xl border border-amber-500/30 z-0" />

        <div className="relative z-10 p-5">
          <button
            onClick={onClose}
            className="absolute right-2 top-2 rounded-full bg-gray-800 p-1 text-gray-400 hover:bg-gray-700 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex flex-col items-center pt-2 pb-4">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-center text-2xl font-bold text-white">Límite Alcanzado</h2>
            <div className="h-1 w-16 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full mt-2" />
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-center bg-red-900/30 rounded-lg p-3 border border-red-500/30">
              <Timer className="h-5 w-5 text-red-400 mr-3 flex-shrink-0 animate-pulse" />
              <div className="flex flex-col">
                <div className="text-xl font-bold text-red-400">{formatTime(timeLeft)}</div>
                <p className="text-xs text-red-300">
                  Después de este tiempo, tu cuenta será bloqueada permanentemente.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center bg-amber-500/10 rounded-lg p-3 mb-4 border border-amber-500/30">
              <Crown className="h-5 w-5 text-amber-400 mr-3 flex-shrink-0" />
              <p className="text-sm text-white">
                Para continuar descubriendo nuevos perfiles, necesitas comprar acceso Premium.
              </p>
            </div>
          </div>

          <div className="mb-4 rounded-lg bg-[#1e293b]/80 p-4 text-center shadow-inner border border-amber-500/20 relative overflow-hidden">
            <div className="absolute -right-8 top-6 bg-amber-500 text-[#1a1a2e] text-xs font-bold py-1 px-8 shadow-md transform rotate-45">
              -85%
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-medium text-gray-400 line-through relative">
                <span className="absolute top-1/2 left-0 right-0 h-[1px] bg-red-500/70 transform -rotate-6" />
                {displayOriginalPrice}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-amber-500">{displayPrice}</span>
                <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">único pago</span>
              </div>
              <div className="mt-2 text-xl font-bold text-white">o 6x de {displayInstallmentPrice}</div>
              <p className="text-sm text-green-400">sin interés con tarjeta de crédito</p>
            </div>
          </div>

          <motion.button
            onClick={onPurchase}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onHoverStart={() => setIsPulsing(true)}
            onHoverEnd={() => setIsPulsing(false)}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 py-3 rounded-md text-base font-bold text-gray-900 hover:from-amber-400 hover:to-amber-500 shadow-lg flex items-center justify-center relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-white"
              animate={{ opacity: isPulsing ? [0, 0.2, 0] : 0 }}
              transition={{ duration: 1.2, repeat: isPulsing ? Number.POSITIVE_INFINITY : 0, repeatType: "loop" }}
            />
            <Lock className="mr-2 h-5 w-5" />
            Obtener Premium
          </motion.button>

          <div className="mt-3 space-y-2">
            <div className="flex items-center">
              <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-xs text-gray-300">Acceso ilimitado a todos los perfiles</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-xs text-gray-300">Mensajes ilimitados</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-3.5 w-3.5 text-amber-400 mr-2 flex-shrink-0" />
              <span className="text-xs text-amber-300 font-medium">Acceso a contenido exclusivo +18</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
