"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Zap, PlayCircle, Phone, MessageSquare, KeyRound, Headphones } from "lucide-react"
import { motion } from "framer-motion"
import ImportantWarningPopup from "@/components/important-warning-popup"

declare global {
  interface Window {
    checkoutElements: any
  }
}

const featureCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
}

const textVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

const listItemVariants = {
  hidden: { opacity: 0, x: -25 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
}

const GoldGradientText = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span
    className={`bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent ${className || ""}`}
  >
    {children}
  </span>
)

export default function Upsell1Screen() {
  const [showWarningPopup, setShowWarningPopup] = useState(false)
  const hotmartWidgetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setShowWarningPopup(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.hotmart.com/lib/hotmart-checkout-elements.js"
    script.async = true
    script.onload = () => {
      if (window.checkoutElements && hotmartWidgetRef.current) {
        window.checkoutElements.init("salesFunnel").mount("#hotmart-sales-funnel")
      }
    }
    document.head.appendChild(script)
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  const features = [
    {
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      title: "Modo Turbo",
      description: "Usa esta automatización para acelerar aún más tus ganancias en la app.",
    },
    {
      icon: <PlayCircle className="w-5 h-5 text-amber-400" />,
      title: "Reels",
      description: "Mira los videos de las maduritas más calientes y gana aún más por hacerlo.",
    },
    {
      icon: <Phone className="w-5 h-5 text-amber-400" />,
      title: "Llamadas Rentables",
      description: "Haz y recibe llamadas privadas y gana más al recibir obsequios y regalos caros.",
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-amber-400" />,
      title: "Chat Premium",
      description: "Cobra y recibe dinero por chatear con las maduritas adineradas.",
    },
    {
      icon: <KeyRound className="w-5 h-5 text-amber-400" />,
      title: "Acceso Vitalicio",
      description: "Obtén acceso a todas las funciones de la app sin limitaciones y sin costo adicional.",
    },
    {
      icon: <Headphones className="w-5 h-5 text-amber-400" />,
      title: "Soporte 24 horas",
      description: "La versión PRO incluye soporte 24/7, personalizado y exclusivo.",
    },
  ]

  const pricingItems = [
    { name: "Conexión Madura PRO", price: "$27.00" },
    { name: "Modo Turbo", price: "$17.00" },
    { name: "Reels", price: "$17.00" },
    { name: "Llamadas Rentables", price: "$17.00" },
    { name: "Chat Premium", price: "$10.00" },
    { name: "Acceso Vitalicio", price: "$12.00" },
    { name: "Soporte 24h", price: "$7.00" },
  ]

  const baseDelay = features.length * 0.15 + 0.2

  const handleCloseWarningPopup = () => setShowWarningPopup(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-black to-neutral-900 text-white flex flex-col relative overflow-hidden">
      <div className="absolute -top-1/4 -left-1/3 w-3/4 h-3/4 bg-amber-500/5 rounded-full blur-[200px] opacity-50 animate-pulse pointer-events-none -z-10"></div>
      <div className="absolute -bottom-1/4 -right-1/3 w-3/4 h-3/4 bg-red-500/5 rounded-full blur-[200px] opacity-50 animate-pulse pointer-events-none -z-10"></div>

      <div className="flex flex-col items-center pt-12 sm:pt-16 pb-20 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="mb-6"
        >
          <Image
            src="/logo-cn-pro-gold.png"
            alt="Conexión Madura PRO Logo"
            width={80}
            height={80}
            className="object-contain"
            priority
          />
        </motion.div>
        <motion.p
          variants={textVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="text-center text-sm sm:text-base font-medium mb-8 sm:mb-10 tracking-wider"
        >
          <GoldGradientText>Conexión Madura PRO</GoldGradientText>
        </motion.p>
        <motion.h1
          variants={textVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="text-4xl sm:text-5xl font-medium text-center mb-2 sm:mb-3 leading-tight text-neutral-100"
        >
          Gana hasta <GoldGradientText>$3,500.00</GoldGradientText> más cada mes
        </motion.h1>
        <motion.h2
          variants={textVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
          className="text-2xl sm:text-3xl font-medium text-center text-neutral-200 mb-12 sm:mb-16"
        >
          con las nuevas funciones de la{" "}
          <GoldGradientText>
            <b>Versión PRO</b>
          </GoldGradientText>
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full max-w-5xl mb-12 sm:mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={featureCardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.7 + index * 0.15 }}
              className="bg-neutral-900/60 backdrop-blur-lg border border-amber-500/20 rounded-2xl p-5 sm:p-6 flex flex-col items-start shadow-lg shadow-black/30 hover:border-amber-500/40 transition-all duration-300 group relative"
            >
              <div className="absolute -inset-px rounded-2xl border border-transparent group-hover:border-amber-600/20 transition-all duration-300 pointer-events-none bg-gradient-radial from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 blur-sm"></div>
              <div className="flex items-center mb-3.5">
                <div className="mr-3.5 flex-shrink-0 p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-neutral-100">{feature.title}</h3>
              </div>
              <p className="text-neutral-300 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          variants={textVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: baseDelay + 0.7 }}
          className="text-center w-full max-w-3xl bg-neutral-900/60 backdrop-blur-lg border border-amber-500/20 rounded-2xl p-8 sm:p-10 shadow-xl shadow-black/40 mb-12 sm:mb-16 relative"
        >
          <div className="absolute -inset-px rounded-2xl border border-transparent hover:border-amber-600/10 transition-all duration-300 pointer-events-none bg-gradient-radial from-amber-500/3 via-transparent to-transparent opacity-0 hover:opacity-100 blur-md"></div>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-neutral-100">
            ...Todo eso y mucho más es lo que vas a desbloquear en la <GoldGradientText>Versión PRO.</GoldGradientText>
          </h2>
          <p className="text-neutral-300 text-base sm:text-lg leading-relaxed">
            Para ser honesto, podríamos cobrar mucho dinero solo por los extras, que fácilmente valen más de $80.00.
            Pero hoy tenemos una sorpresa especial para ti... Pero antes, vamos a recordar todo lo que vas a recibir:
          </p>
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={textVariants}
          transition={{ delay: baseDelay + 0.9 }}
          className="w-full max-w-xl bg-neutral-900/60 backdrop-blur-lg border border-amber-500/20 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/40 mb-8 sm:mb-10 relative"
        >
          <div className="absolute -inset-px rounded-2xl border border-transparent hover:border-amber-600/10 transition-all duration-300 pointer-events-none bg-gradient-radial from-amber-500/3 via-transparent to-transparent opacity-0 hover:opacity-100 blur-md"></div>
          <ul className="space-y-3.5">
            {pricingItems.map((item, index) => (
              <motion.li
                key={item.name}
                custom={index}
                variants={listItemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: baseDelay + 1.1 + index * 0.1 }}
                className="flex justify-between items-center text-neutral-200 text-sm sm:text-base border-b border-neutral-700/60 pb-3.5 last:border-b-0 last:pb-0"
              >
                <span>{item.name}</span>
                <GoldGradientText className="font-semibold">{item.price}</GoldGradientText>
              </motion.li>
            ))}
          </ul>
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={textVariants}
          transition={{ delay: baseDelay + 1.3 }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-2xl sm:text-3xl font-medium text-neutral-300 mb-3">
            ...Todo esto por solo <span className="line-through text-neutral-400">US$ 107.00</span>
          </p>
          <p className="text-neutral-300 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            Obviamente, no voy a cobrarte ese valor hoy, pero estoy seguro de que lo valdría cada centavo.
          </p>
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={textVariants}
          transition={{ delay: baseDelay + 1.5 }}
          className="w-full max-w-2xl bg-black/50 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-amber-900/20 relative overflow-hidden flex flex-col items-center"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent opacity-70"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent opacity-70"></div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-4 text-neutral-100">
            ¡Pero hoy quiero darte un <br className="sm:hidden" />
            <GoldGradientText>regalo especial!</GoldGradientText>
          </h2>
          <p className="text-neutral-200 text-center text-base sm:text-lg leading-relaxed mb-6">
            Añade Conexión Madura PRO a tu paquete con un{" "}
            <GoldGradientText className="font-bold">50% de descuento</GoldGradientText> y empieza a ganar{" "}
            <GoldGradientText className="font-bold">8X más</GoldGradientText> desde hoy mismo.
          </p>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={textVariants}
            transition={{ delay: baseDelay + 1.7 }}
            className="text-center mb-6"
          >
            <p className="text-2xl sm:text-3xl font-medium text-neutral-200">
              De <span className="line-through text-neutral-400 text-xl sm:text-2xl">$47,00</span> a{" "}
              <GoldGradientText className="font-bold text-3xl sm:text-4xl">$27,00</GoldGradientText>
            </p>
          </motion.div>
          <div id="hotmart-sales-funnel" ref={hotmartWidgetRef} className="w-full max-w-md"></div>
        </motion.div>
      </div>
      <ImportantWarningPopup isOpen={showWarningPopup} onClose={handleCloseWarningPopup} />
    </div>
  )
}
