"use client"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Lock, X, Timer, CheckCircle, Star, Camera, ShieldCheck } from "lucide-react"
import { useCurrency } from "@/hooks/use-currency"

interface VipPopupProps {
  onPurchase: () => void
  onClose: () => void
}

export function VipPopup({ onPurchase, onClose }: VipPopupProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 23, seconds: 45 })
  const { formatCurrency, formatCurrencyWithContext, isLoaded: currencyLoaded } = useCurrency()

  // Add these lines to get current page context
  const pathname = usePathname()
  const hotmartUrl = "https://pay.hotmart.com/V100751791G?off=vh1anc0h&checkoutMode=10"

  // Update the price display
  const displayPrice = currencyLoaded ? formatCurrencyWithContext(14.9, pathname, hotmartUrl) : "$14.90"

  const displayOriginalPrice = currencyLoaded ? formatCurrencyWithContext(97.9, pathname, hotmartUrl) : "$97.90"

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const format = (num: number) => num.toString().padStart(2, "0")

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-xs rounded-xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] to-[#16213e] z-0" />
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-amber-500/10 blur-xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-amber-500/10 blur-xl" />

        <div className="relative z-10 p-4">
          <button
            onClick={onClose}
            className="absolute right-2 top-2 rounded-full p-1 text-gray-400 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col items-center pt-2 pb-3">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg">
              <Lock className="h-8 w-8 text-white" strokeWidth={1.5} />
            </div>
            <h2 className="text-center text-2xl font-bold text-white">Acceso VIP Exclusivo</h2>
          </div>

          <div className="mb-2 rounded-lg bg-[#252a3d]/80 p-3 text-center shadow-inner relative overflow-hidden">
            <div className="absolute -right-8 top-0 bg-red-500 text-white text-xs font-bold py-1 px-8 shadow-md transform rotate-45">
              -85%
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-sm font-medium text-gray-400 line-through">{displayOriginalPrice}</span>
              <span className="text-3xl font-bold text-amber-500">{displayPrice}</span>
            </div>
            <div className="mt-2 flex items-center justify-center gap-1 bg-[#1a1a2e] rounded-md py-1 px-2">
              <Timer className="h-3 w-3 text-red-400 animate-pulse" />
              <span className="text-xs text-red-400">
                La oferta expira en:
                <span className="font-bold ml-1">
                  {format(timeLeft.hours)}h {format(timeLeft.minutes)}m {format(timeLeft.seconds)}s
                </span>
              </span>
            </div>
          </div>

          <div className="mb-3 text-center">
            <p className="text-xs font-bold text-red-400 uppercase tracking-wide">
              ¡Solo hoy! ¡Últimas horas para aprovechar!
            </p>
          </div>

          <ul className="mb-4 space-y-2.5">
            <li className="flex items-center text-sm text-gray-300">
              <div className="mr-3 flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircle className="h-3 w-3 text-green-500" />
              </div>
              Acceso ilimitado a todos los perfiles
            </li>
            <li className="flex items-center text-sm text-gray-300">
              <div className="mr-3 flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircle className="h-3 w-3 text-green-500" />
              </div>
              Mensajes ilimitados
            </li>
            <li className="flex items-center text-sm text-gray-300">
              <div className="mr-3 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20">
                <Star className="h-3 w-3 text-amber-500" />
              </div>
              Ver quién le gustó tu perfil
            </li>
            <li className="flex items-center text-sm text-gray-300">
              <div className="mr-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20">
                <ShieldCheck className="h-3 w-3 text-blue-500" />
              </div>
              Perfiles premium verificados
            </li>
            <li className="flex items-center text-sm text-amber-400 font-medium">
              <div className="mr-3 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20">
                <Camera className="h-3 w-3 text-amber-500" />
              </div>
              Acceso a contenido exclusivo +18
            </li>
          </ul>

          <motion.button
            onClick={onPurchase}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 py-3 rounded-md text-base font-bold text-gray-900 hover:from-amber-400 hover:to-amber-500 shadow-lg flex items-center justify-center relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
              animate={{ scale: [1, 1.05, 1], opacity: [0, 0.2, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
            <Lock className="mr-2 h-5 w-5" />
            Obtener Acceso VIP
          </motion.button>
          <p className="text-center text-xs text-gray-400 mt-2">Cancela en cualquier momento</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
