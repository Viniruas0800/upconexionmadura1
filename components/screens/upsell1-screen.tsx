"use client"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, Crown, Zap, Shield, Gift, CheckCircle, Clock, ArrowRight, Play, Phone, AlertTriangle } from "lucide-react"
import { useViewportHeight } from "@/hooks/use-viewport-height"

interface Upsell1ScreenProps {
  onNavigate: (
    screen: "home" | "login" | "registration" | "profile-setup" | "welcome" | "discover" | "chat" | "upsell1",
    chatId?: string,
  ) => void
}

export default function Upsell1Screen({ onNavigate }: Upsell1ScreenProps) {
  useViewportHeight()

  const [timeLeft, setTimeLeft] = useState(5 * 60) // 5 minutes in seconds
  const [showExitIntent, setShowExitIntent] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [showBonusAnimation, setShowBonusAnimation] = useState(false)
  const [showImportantPopup, setShowImportantPopup] = useState(true)
  const exitIntentShown = useRef(false)

  // Testimonials data
  const testimonials = [
    {
      name: "Carlos M.",
      age: 34,
      location: "México",
      image: "/testimonials/testimonials01.webp",
      text: "En solo 2 semanas ya gané más de $500. Las mujeres aquí son increíbles y muy generosas.",
      earnings: "$847",
      verified: true,
    },
    {
      name: "Roberto S.",
      age: 28,
      location: "Estados Unidos",
      image: "/testimonials/testimonials02.webp",
      text: "Nunca pensé que sería tan fácil. Recibo regalos todos los días y las conversaciones son geniales.",
      earnings: "$623",
      verified: true,
    },
    {
      name: "Diego L.",
      age: 31,
      location: "Colombia",
      image: "/testimonials/testimonials03.webp",
      text: "La mejor decisión que tomé este año. Ya pude pagar mis cuentas solo con los regalos que recibo.",
      earnings: "$1,234",
      verified: true,
    },
  ]

  // Features data
  const features = [
    {
      icon: <Crown className="w-6 h-6" />,
      title: "Acceso VIP Ilimitado",
      description: "Conecta con mujeres maduras premium sin restricciones",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: <Gift className="w-6 h-6" />,
      title: "Regalos Garantizados",
      description: "Recibe hasta 5x más regalos que usuarios gratuitos",
      color: "from-pink-500 to-pink-600",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Perfil Verificado",
      description: "Badge dorado que aumenta tu credibilidad 300%",
      color: "from-green-500 to-green-600",
    },
    {
      icon: <Play className="w-6 h-6" />,
      title: "Reels",
      description: "Con la Versión PRO puedes ver videos cortos de las maduritas más sexys.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Turbo",
      description: "Con esta función disponible en la Versión PRO puedes acelerar hasta 3X tus resultados.",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Llamadas",
      description: "Con la Versión PRO puedes hacer llamadas calientes 😈 en el chat ¡e incluso recibir pago por ello!",
      color: "from-red-500 to-red-600",
    },
  ]

  // Bonus features
  const bonusFeatures = [
    "🎯 Algoritmo inteligente que te conecta con las mujeres más generosas",
    "💰 Sistema de comisiones exclusivo con pagos hasta 50% más altos",
    "🔥 Acceso a eventos VIP y encuentros exclusivos",
    "📱 Soporte prioritario 24/7 con respuesta en menos de 1 hora",
    "🎁 Kit de inicio con $100 en créditos gratuitos",
  ]

  // Animation variants for important popup
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

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  // Visibility effect
  useEffect(() => {
    setIsVisible(true)
    // Show bonus animation after 3 seconds
    const bonusTimer = setTimeout(() => {
      setShowBonusAnimation(true)
    }, 3000)
    return () => clearTimeout(bonusTimer)
  }, [])

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !exitIntentShown.current) {
        setShowExitIntent(true)
        exitIntentShown.current = true
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave)
    return () => document.removeEventListener("mouseleave", handleMouseLeave)
  }, [])

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handlePurchase = () => {
    const baseCheckoutUrl = "https://pay.hotmart.com/V101102013W?checkoutMode=10"

    // Get current URL parameters
    const currentParams = new URLSearchParams(window.location.search)

    // Parse the base checkout URL to separate base and existing params
    const [baseUrl, existingParams] = baseCheckoutUrl.split("?")
    const checkoutParams = new URLSearchParams(existingParams || "")

    // Add current page parameters to checkout parameters
    currentParams.forEach((value, key) => {
      // Only add if not already present in checkout URL
      if (!checkoutParams.has(key)) {
        checkoutParams.set(key, value)
      }
    })

    const finalUrl = `${baseUrl}?${checkoutParams.toString()}`
    window.location.href = finalUrl
  }

  const handleBackRedirect = () => {
    const baseCheckoutUrl = "https://pay.hotmart.com/V101102013W?off=k9gpixhe&checkoutMode=10"

    // Get current URL parameters
    const currentParams = new URLSearchParams(window.location.search)

    // Parse the base checkout URL to separate base and existing params
    const [baseUrl, existingParams] = baseCheckoutUrl.split("?")
    const checkoutParams = new URLSearchParams(existingParams || "")

    // Add current page parameters to checkout parameters
    currentParams.forEach((value, key) => {
      // Only add if not already present in checkout URL
      if (!checkoutParams.has(key)) {
        checkoutParams.set(key, value)
      }
    })

    const finalUrl = `${baseUrl}?${checkoutParams.toString()}`
    window.location.href = finalUrl
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-[#e9b208]/10 blur-xl opacity-30 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-yellow-500/10 blur-xl opacity-30 animate-pulse" />
        <div className="absolute top-3/4 left-1/2 w-24 h-24 rounded-full bg-blue-500/10 blur-xl opacity-30 animate-pulse" />
      </div>

      <div className="relative z-10">
        {/* Header with Timer */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image src="/logo-cn-pro.png" alt="Logo" width={40} height={40} className="object-contain" />
                <div>
                  <h1 className="text-lg font-bold">
                    <span className="text-[#e9b208]">Conexión</span>
                    <span className="text-white">Madura</span>
                    <span className="text-yellow-500 ml-2">PRO</span>
                  </h1>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center gap-2 bg-red-600/20 border border-red-500/30 rounded-full px-4 py-2">
                <Clock className="w-4 h-4 text-red-400" />
                <span className="text-red-400 font-mono font-bold">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          className="container mx-auto px-4 py-8"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 rounded-full px-4 py-2 mb-4"
            >
              <Zap className="w-4 h-4 text-red-400" />
              <span className="text-red-400 font-semibold text-sm">OFERTA LIMITADA</span>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
            >
              Desbloquea el{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-400">
                Potencial Completo
              </span>
              <br />
              de Conexión Madura
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Únete a más de <span className="text-[#e9b208] font-semibold">10,000 hombres</span> que ya están ganando
              dinero real conectando con mujeres maduras exitosas
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8"
            >
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <div className="text-2xl font-bold text-[#e9b208]">$2,847</div>
                <div className="text-sm text-gray-400">Promedio mensual</div>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <div className="text-2xl font-bold text-[#22c55e]">95%</div>
                <div className="text-sm text-gray-400">Tasa de éxito</div>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <div className="text-2xl font-bold text-green-500">24h</div>
                <div className="text-sm text-gray-400">Primer pago</div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Grid */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="container mx-auto px-4 py-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            Lo que obtienes con{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-400">PRO</span>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Testimonials */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="container mx-auto px-4 py-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            Lo que dicen nuestros{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-400">
              usuarios PRO
            </span>
          </h2>

          <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#e9b208]">
                      <Image
                        src={testimonials[currentTestimonial].image || "/placeholder.svg"}
                        alt={testimonials[currentTestimonial].name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {testimonials[currentTestimonial].verified && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-white">{testimonials[currentTestimonial].name}</h4>
                      <span className="text-sm text-gray-400">
                        {testimonials[currentTestimonial].age} años, {testimonials[currentTestimonial].location}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-3 leading-relaxed">"{testimonials[currentTestimonial].text}"</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Ganancias este mes:</span>
                      <span className="font-bold text-green-400">{testimonials[currentTestimonial].earnings}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Testimonial indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentTestimonial ? "bg-[#e9b208] w-6" : "bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.section>

        {/* Bonus Section */}
        <AnimatePresence>
          {showBonusAnimation && (
            <motion.section
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="container mx-auto px-4 py-8"
            >
              <div className="max-w-3xl mx-auto">
                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  className="bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 border-2 border-yellow-500/30 rounded-2xl p-6 relative overflow-hidden"
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/5 to-transparent animate-pulse" />

                  <div className="relative z-10">
                    <div className="text-center mb-6">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        className="inline-block text-4xl mb-2"
                      >
                        🎁
                      </motion.div>
                      <h3 className="text-2xl font-bold text-yellow-400 mb-2">¡BONUS EXCLUSIVO!</h3>
                      <p className="text-gray-300">Solo para los primeros 100 usuarios PRO de hoy</p>
                    </div>

                    <div className="space-y-3">
                      {bonusFeatures.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3 text-gray-300"
                        >
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span>{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Pricing Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="container mx-auto px-4 py-8"
        >
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-b from-[#101624] to-[#0c1220] backdrop-blur-sm rounded-2xl p-8 border-2 border-[#e9b208]/30 relative overflow-hidden">
              {/* Animated border */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#e9b208]/20 via-yellow-500/20 to-[#e9b208]/20 animate-pulse rounded-2xl" />

              <div className="relative z-10">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-[#e9b208]/20 rounded-full px-4 py-2 mb-4">
                    <Crown className="w-4 h-4 text-[#e9b208]" />
                    <span className="text-[#e9b208] font-semibold text-sm">PLAN PRO</span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-3xl text-gray-400 line-through">$47</span>
                      <span className="text-5xl font-bold text-white">$27</span>
                    </div>
                    <p className="text-gray-400">Pago único - Sin mensualidades</p>
                  </div>

                  <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-3 mb-6">
                    <p className="text-green-400 font-semibold">
                      💰 Garantía: Recupera tu inversión en las primeras 48 horas o te devolvemos tu dinero
                    </p>
                  </div>
                </div>

                {/* REPLACED BUTTON BLOCK */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: `
	<div style="width: auto; max-width: 400px;">
        <a href="javascript:void(0)" data-fornpay="9iizzaxncw" class="fornpay_btn">DESBLOQUEAR ACCESO PRO</a>
        <a href="javascript:void(0)" data-downsell="https://dwnconexionmadura1.vercel.app/" class="fornpay_downsell">No quiero esta oferta con descuento.</a>
			
    </div>
    <style>
    .fornpay_btn {
        background: #4CAF50;
        background-image: -webkit-linear-gradient(top, #4CAF50, #2E7D32);
        background-image: -moz-linear-gradient(top, #4CAF50, #2E7D32);
        background-image: -ms-linear-gradient(top, #4CAF50, #2E7D32);
        background-image: -o-linear-gradient(top, #4CAF50, #2E7D32);
        background-image: -webkit-gradient(to bottom, #4CAF50, #2E7D32);
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
        color: #fff;
        font-family: Arial;
        font-size: 18px;
        font-weight: 100;
        padding: 10px 20px;
        border: 1px solid #2E7D32;
        text-decoration: none;
        display: block;
        cursor: pointer;
        text-align: center;
    }

    .fornpay_downsell {
        color: #3b3a3a;
        font-family: Arial;
        margin-top: 10px;
        font-size: 16px!important;
        font-weight: 100;
        text-decoration: none;
        display: block;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        text-align: center;
    }
    </style>

                    `,
                  }}
                />


                <div className="text-center mt-4">
                  <p className="text-xs text-gray-500">🔒 Pago seguro procesado por Hotmart • Garantía de 7 días</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="container mx-auto px-4 py-8 text-center"
        >
          <p className="text-gray-500 text-sm mb-4">Esta oferta expira en {formatTime(timeLeft)} • No se repetirá</p>
          <button
            onClick={handleBackRedirect}
            className="text-gray-400 hover:text-gray-300 text-sm underline transition-colors"
          >
            No, prefiero continuar con la versión gratuita limitada
          </button>
        </motion.footer>
      </div>

      {/* Important Popup */}
      <AnimatePresence>
        {showImportantPopup && (
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
                      filter: "drop-shadow(0 0 4px rgba(239, 68, 68, 0.2))",
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
                    onClick={() => setShowImportantPopup(false)}
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

{/* Exit Intent Popup */} 
<AnimatePresence>
  {showExitIntent && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 hidden" // 👈 Linha modificada aqui
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-b from-gray-900 to-black rounded-2xl p-8 max-w-md w-full border-2 border-red-500/30 relative"
      >
        <button
          onClick={() => setShowExitIntent(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-white mb-4">¡Espera!</h3>
          <p className="text-gray-300 mb-6">
            Antes de irte, toma esta oferta especial de{" "}
            <span className="text-red-400 font-bold">50% de descuento</span> que no verás de nuevo.
          </p>

          <div className="space-y-4">
            <Button
              onClick={handlePurchase}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 rounded-xl"
            >
              SÍ, QUIERO EL 50% DE DESCUENTO
            </Button>

            <button
              onClick={() => setShowExitIntent(false)}
              className="w-full text-gray-400 hover:text-gray-300 py-2 text-sm"
            >
              No gracias, continuar sin descuento
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </div>
  )
}
