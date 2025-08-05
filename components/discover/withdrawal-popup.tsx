"use client"
import { motion } from "framer-motion"
import type React from "react"
import { usePathname } from "next/navigation"
import { useCurrency } from "@/hooks/use-currency"

import { Button } from "@/components/ui/button"
import { Lock, X, DollarSign, Heart, Zap, MessageSquare, ChevronRight } from "lucide-react"

interface WithdrawalPopupProps {
  balance: string
  onPurchase: () => void
  onClose: () => void
}

export function WithdrawalPopup({ balance, onPurchase, onClose }: WithdrawalPopupProps) {
  const { formatCurrency, formatCurrencyWithContext, isLoaded: currencyLoaded } = useCurrency()

  // Add these lines to get current page context
  const pathname = usePathname()
  const hotmartUrl = "https://pay.hotmart.com/V100751791G?off=8nixgdw6&checkoutMode=10"

  // Update the price display
  const displayPrice = currencyLoaded ? formatCurrencyWithContext(14.9, pathname, hotmartUrl) : "$14.90"

  const displayOriginalPrice = currencyLoaded ? formatCurrencyWithContext(97.9, pathname, hotmartUrl) : "$97.90"

  const displayInstallmentPrice = currencyLoaded ? formatCurrencyWithContext(2.82, pathname, hotmartUrl) : "$2.82"

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
        className="relative w-full max-w-md rounded-xl border-2 border-yellow-500 bg-[#111827] p-6 shadow-lg overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full bg-gray-800 p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white z-10"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl" />

        <div className="mb-6 flex flex-col items-center relative z-10">
          <motion.div
            className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600"
            animate={{
              boxShadow: [
                "0 0 0 rgba(250, 204, 21, 0.4)",
                "0 0 20px rgba(250, 204, 21, 0.7)",
                "0 0 0 rgba(250, 204, 21, 0.4)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <Lock className="h-8 w-8 text-gray-900" />
          </motion.div>
          <h2 className="text-center text-2xl font-bold text-white">Retiro Premium VIP</h2>
          <p className="mt-2 text-center text-gray-400">Para retirar tu saldo, necesitas ser miembro Premium VIP.</p>
        </div>

        <div className="mb-6 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 p-4 text-center">
          <p className="text-sm text-gray-400 mb-1">Tu saldo actual</p>
          <div className="text-2xl font-bold text-yellow-500">$ {balance}</div>
          <p className="mt-1 text-xs text-gray-500">Disponible solo para miembros Premium</p>
        </div>

        <div className="mb-6 space-y-3">
          <h3 className="text-sm font-medium text-yellow-500 mb-2">Beneficios Premium VIP:</h3>
          <Benefit
            icon={<DollarSign className="h-4 w-4 text-green-500" />}
            title="Retiro Instantáneo"
            description="Retira tu saldo en cualquier momento"
          />
          <Benefit
            icon={<Heart className="h-4 w-4 text-pink-500" />}
            title="Likes Ilimitados"
            description="Sin límites para dar likes a perfiles"
          />
          <Benefit
            icon={<Zap className="h-4 w-4 text-blue-500" />}
            title="Turbo"
            description="Gana 3x más por dar likes a perfiles"
          />
          <Benefit
            icon={<MessageSquare className="h-4 w-4 text-purple-500" />}
            title="Chat Prioritario"
            description="Acceso prioritario a conversaciones"
          />
        </div>

        <div className="mb-6 rounded-lg bg-[#1e293b] p-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <span className="text-sm font-medium text-gray-400 line-through">{displayOriginalPrice}</span>
            <span className="text-2xl font-bold text-yellow-500">{displayPrice}</span>
            <span className="text-xs bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded">único pago</span>
          </div>
          <div className="mt-1 text-base font-bold text-white">o 6x de {displayInstallmentPrice}</div>
          <p className="text-xs text-gray-400">sin interés con tarjeta de crédito</p>
        </div>

        <Button
          onClick={onPurchase}
          className="w-full relative overflow-hidden bg-gradient-to-r from-yellow-600 to-yellow-500 py-4 text-base font-bold text-gray-900 hover:from-yellow-500 hover:to-yellow-400 shadow-md"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 0.5 }}
          />
          <span className="relative z-10 flex items-center justify-center">
            <Lock className="mr-2 h-5 w-5" />
            Obtener Premium VIP
            <ChevronRight className="ml-2 h-4 w-4" />
          </span>
        </Button>
      </motion.div>
    </motion.div>
  )
}

const Benefit = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="flex items-center bg-gray-800/50 rounded-lg p-3">
    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-700">{icon}</div>
    <div className="flex-1">
      <p className="text-sm font-medium text-white">{title}</p>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  </div>
)
