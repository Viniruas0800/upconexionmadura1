"use client"
import { useEffect, useRef } from "react"
import { motion, animate } from "framer-motion"
import { Button } from "@/components/ui/button"
import { DollarSign, CheckCircle } from "lucide-react"
import { format } from "currency-formatter"

interface RewardPopupProps {
  amount: string
  onClose: () => void
  onContinue: () => void
  formatCurrency?: (amount: number | string) => string
  currencyLoaded?: boolean
}

function Counter({ to }: { to: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = nodeRef.current
    if (!node) return

    const controls = animate(0, to, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate(value) {
        node.textContent = value.toFixed(2)
      },
    })

    return () => controls.stop()
  }, [to])

  return <span ref={nodeRef}>0.00</span>
}

export function RewardPopup({ amount, onClose, onContinue, formatCurrency, currencyLoaded = false }: RewardPopupProps) {
  const parsedAmount = Number.parseFloat(amount)

  // Use currency formatting if available, otherwise fallback to USD
  const displayAmount =
    currencyLoaded && formatCurrency ? formatCurrency(parsedAmount) : format(parsedAmount, { code: "USD" })

  const popupVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        variants={popupVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xs sm:max-w-sm rounded-xl border border-green-500/30 bg-gray-900/90 backdrop-blur-md p-4 sm:p-6 shadow-2xl mx-4"
      >
        <div className="mb-4 flex flex-col items-center">
          <motion.div
            className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-500/50"
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
            transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
          >
            <DollarSign className="h-8 w-8 text-gray-900" />
          </motion.div>
          <motion.div variants={itemVariants} className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            <h2 className="text-xl font-bold text-white">¡Pago Recibido!</h2>
          </motion.div>
        </div>
        <motion.div
          variants={itemVariants}
          className="mb-4 rounded-lg bg-gray-800/80 backdrop-blur-sm p-4 text-center border border-green-500/20"
        >
          <span className="text-3xl sm:text-4xl font-bold text-green-500">{displayAmount}</span>
        </motion.div>
        <motion.p variants={itemVariants} className="mb-4 text-center text-sm sm:text-base text-gray-300 px-2">
          ¡A las chicas les <span className="text-green-400">encanta</span> recibir likes y pagan por ello!
        </motion.p>
        <motion.p
          variants={itemVariants}
          className="mb-4 flex items-center justify-center text-xs sm:text-sm text-green-400"
        >
          <span className="mr-1">❤️</span> ¡Sigue dando likes y gana más!
        </motion.p>
        <motion.div variants={itemVariants}>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <Button
              onClick={onContinue}
              className="w-full bg-green-500 py-4 sm:py-5 text-sm sm:text-base font-semibold text-gray-900 hover:bg-green-600 shadow-lg hover:shadow-green-500/30 transition-all duration-200"
            >
              SEGUIR DANDO LIKES
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
