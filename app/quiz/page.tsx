"use client"
import { useState, useEffect } from "react"
import type React from "react"
import Head from "next/head"

import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Gift,
  ChevronRight,
  Star,
  Heart,
  Clock,
  Shield,
  CheckCircle,
  XCircle,
  HelpCircle,
  Crown,
  Users,
  MessageCircle,
  Award,
} from "lucide-react"

interface QuizOption {
  id: string
  icon: React.ReactNode
  text: string
  value: string
}

export default function QuizPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [showRejection, setShowRejection] = useState(false)
  const [progressAnimated, setProgressAnimated] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Quiz questions and options
  const quizData = [
    {
      step: 1,
      question:
        "¿Estás realmente interesado en conocer mujeres maduras reales y ganar dinero por interactuar con ellas?",
      options: [
        {
          id: "1a",
          icon: <Heart className="w-5 h-5" />,
          text: "¡Sí, muy interesado!",
          value: "interested",
        },
        {
          id: "1b",
          icon: <HelpCircle className="w-5 h-5" />,
          text: "No estoy seguro todavía.",
          value: "unsure",
        },
        {
          id: "1c",
          icon: <XCircle className="w-5 h-5" />,
          text: "No estoy interesado.",
          value: "not_interested",
        },
      ],
    },
    {
      step: 2,
      question:
        '¿Puedes invertir al menos 10 minutos de tu día dando "me gusta" y conversando con mujeres maduras para ganar dinero REAL?',
      options: [
        {
          id: "2a",
          icon: <CheckCircle className="w-5 h-5" />,
          text: "¡Sí, puedo fácilmente!",
          value: "can_invest_time",
        },
        {
          id: "2b",
          icon: <Clock className="w-5 h-5" />,
          text: "No, no tengo tiempo.",
          value: "no_time",
        },
      ],
    },
    {
      step: 3,
      question:
        "¿Aceptas seguir las reglas de la aplicación, respetando a las mujeres y manteniendo conversaciones interesantes y educadas?",
      options: [
        {
          id: "3a",
          icon: <Shield className="w-5 h-5" />,
          text: "¡Sí, estoy totalmente de acuerdo!",
          value: "accept_rules",
        },
        {
          id: "3b",
          icon: <XCircle className="w-5 h-5" />,
          text: "No, no quiero seguir esas reglas.",
          value: "reject_rules",
        },
      ],
    },
  ]

  const currentQuizData = quizData.find((q) => q.step === currentStep)

  // Preserve URL parameters for redirect
  const getCurrentUrlParams = () => {
    if (typeof window === "undefined") return ""
    const searchParams = new URLSearchParams(window.location.search)
    return searchParams.toString() ? `?${searchParams.toString()}` : ""
  }

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId)
  }

  const nextStep = () => {
    if (!selectedOption) return

    setIsTransitioning(true)

    setTimeout(() => {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1)
        setSelectedOption(null)
      } else {
        handleShowResult()
      }
      setIsTransitioning(false)
    }, 300)
  }

  const handleShowResult = () => {
    setShowResult(true)
    setSelectedOption(null)
    // Animate progress bar after a short delay
    setTimeout(() => {
      setProgressAnimated(true)
    }, 500)
  }

  const handleShowRejection = () => {
    setShowRejection(true)
    setSelectedOption(null)
  }

  const handleRestart = () => {
    setCurrentStep(1)
    setSelectedOption(null)
    setShowResult(false)
    setShowRejection(false)
    setProgressAnimated(false)
    setIsTransitioning(false)
  }

  const handleAcceptInvitation = () => {
    const params = getCurrentUrlParams()
    router.push(`/${params}`)
  }

  const getProgressPercentage = () => {
    return (currentStep / 3) * 100
  }

  // Auto-advance after option selection
  useEffect(() => {
    if (selectedOption && !isTransitioning) {
      const timer = setTimeout(() => {
        nextStep()
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [selectedOption, isTransitioning])

  return (
    <>
      <Head>
        {/* Meta Pixel Code 1 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1871870563385241');
            fbq('track', 'PageView');
          `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1871870563385241&ev=PageView&noscript=1"
          />
        </noscript>

        {/* Meta Pixel Code 2 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1492856788831778');
            fbq('track', 'PageView');
          `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1492856788831778&ev=PageView&noscript=1"
          />
        </noscript>
      </Head>

      <div className="min-h-screen relative overflow-hidden">
        {/* Enhanced Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-900/20 via-transparent to-purple-900/20" />

          {/* Animated background elements */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-3/4 left-1/2 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>

        {/* Main container */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <AnimatePresence mode="wait">
              {!showResult && !showRejection && (
                <motion.div
                  key={`step-${currentStep}`}
                  initial={{ opacity: 0, x: 50, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -50, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <QuizCard
                    currentStep={currentStep}
                    totalSteps={3}
                    question={currentQuizData?.question || ""}
                    options={currentQuizData?.options || []}
                    selectedOption={selectedOption}
                    onOptionSelect={handleOptionSelect}
                    progressPercentage={getProgressPercentage()}
                  />
                </motion.div>
              )}

              {/* Enhanced Result Screen */}
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  {/* Enhanced Result Card Component - Refined and 15% smaller */}
                  <ResultCard onAcceptInvitation={handleAcceptInvitation} progressAnimated={progressAnimated} />
                </motion.div>
              )}

              {/* Enhanced Rejection Screen */}
              {showRejection && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <RejectionCard onRestart={handleRestart} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  )
}

// Enhanced Quiz Card Component
function QuizCard({
  currentStep,
  totalSteps,
  question,
  options,
  selectedOption,
  onOptionSelect,
  progressPercentage,
}: {
  currentStep: number
  totalSteps: number
  question: string
  options: QuizOption[]
  selectedOption: string | null
  onOptionSelect: (optionId: string) => void
  progressPercentage: number
}) {
  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
      {/* Header with Logo */}
      <div className="text-center mb-8">
        <motion.div
          className="w-20 h-20 mx-auto mb-6"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/25">
            <Heart className="w-10 h-10 text-white" />
          </div>
        </motion.div>

        {/* Brand Title */}
        <motion.div
          className="text-3xl font-bold mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-white">Conexión</span>
          <span className="ml-1 bg-gradient-to-r from-pink-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            Madura
          </span>
        </motion.div>

        {/* Step Indicator */}
        <motion.div
          className="flex items-center justify-center gap-2 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {[...Array(totalSteps)].map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index + 1 <= currentStep
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg shadow-pink-500/50"
                  : "bg-white/20"
              }`}
            />
          ))}
          <span className="ml-3 text-white/70 text-sm font-medium">
            Paso {currentStep} de {totalSteps}
          </span>
        </motion.div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-8">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full shadow-lg shadow-pink-500/50"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Question */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-white text-xl font-semibold leading-relaxed text-center">{question}</h2>
      </motion.div>

      {/* Options */}
      <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        {options.map((option, index) => (
          <OptionButton
            key={option.id}
            option={option}
            isSelected={selectedOption === option.id}
            onSelect={() => onOptionSelect(option.id)}
            delay={index * 0.1}
          />
        ))}
      </motion.div>
    </div>
  )
}

// Enhanced Option Button Component
function OptionButton({
  option,
  isSelected,
  onSelect,
  delay,
}: {
  option: QuizOption
  isSelected: boolean
  onSelect: () => void
  delay: number
}) {
  return (
    <motion.button
      onClick={onSelect}
      className={`w-full p-5 rounded-2xl text-left transition-all duration-300 flex items-center gap-4 group relative overflow-hidden ${
        isSelected
          ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-2 border-pink-500/50 shadow-lg shadow-pink-500/25"
          : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20"
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background gradient on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isSelected ? "opacity-100" : ""}`}
      />

      {/* Icon */}
      <div
        className={`relative z-10 p-3 rounded-xl transition-all duration-300 ${
          isSelected
            ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/50"
            : "bg-white/10 text-pink-400 group-hover:bg-white/20"
        }`}
      >
        {option.icon}
      </div>

      {/* Text */}
      <div className="relative z-10 flex-1">
        <span
          className={`text-lg font-medium transition-colors duration-300 ${
            isSelected ? "text-white" : "text-white/90 group-hover:text-white"
          }`}
        >
          {option.text}
        </span>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          className="relative z-10 p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
        >
          <CheckCircle className="w-5 h-5 text-white" />
        </motion.div>
      )}

      {/* Ripple effect */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}
    </motion.button>
  )
}

// Enhanced Result Card Component - Refined and 15% smaller
function ResultCard({
  onAcceptInvitation,
  progressAnimated,
}: {
  onAcceptInvitation: () => void
  progressAnimated: boolean
}) {
  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
      {/* Header - Reduced sizes */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/25"
        >
          <Crown className="w-8 h-8 text-white" />
        </motion.div>

        {/* Stars - Slightly smaller */}
        <motion.div
          className="flex justify-center gap-1 mb-3"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
            </motion.div>
          ))}
        </motion.div>

        {/* Title - Reduced size */}
        <motion.h1
          className="text-white text-2xl font-bold mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Invitación Exclusiva
        </motion.h1>

        {/* Subtitle - Reduced size and spacing */}
        <motion.p
          className="text-white/90 leading-relaxed mb-6 text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          ¡Felicidades! Has sido seleccionado para comenzar a{" "}
          <span className="font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Ganar dinero REAL
          </span>{" "}
          con mujeres maduras increíbles ahora mismo.
        </motion.p>
      </div>

      {/* Opportunity Card - Reduced padding */}
      <motion.div
        className="border-2 border-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-4 mb-6 bg-gradient-to-br from-pink-500/10 to-purple-500/10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/50">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-white font-bold text-base">Oportunidad Limitada</div>
            <div className="text-white/70 text-sm">Solo 50 plazas disponibles hoy para nuevos miembros</div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-2">
          <span className="text-white/70 text-sm">Vacantes restantes</span>
          <span className="text-white font-bold text-xl">7</span>
        </div>

        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full shadow-lg shadow-pink-500/50"
            initial={{ width: 0 }}
            animate={{ width: progressAnimated ? "70%" : 0 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      {/* Benefits - Reduced spacing */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-400" />
          Beneficios Exclusivos:
        </h3>
        <div className="space-y-3">
          <BenefitItem icon={<Users className="w-4 h-4" />} text="Acceso a perfiles premium de maduritas" delay={0.1} />
          <BenefitItem
            icon={<Gift className="w-4 h-4" />}
            text="Recibe regalos y transferencias de las maduritas"
            delay={0.2}
          />
          <BenefitItem
            icon={<MessageCircle className="w-4 h-4" />}
            text="Prioridad en matches y conversaciones"
            delay={0.3}
          />
        </div>
      </motion.div>

      {/* CTA Button - Enhanced with smooth pulsing animation */}
      <motion.button
        onClick={onAcceptInvitation}
        className="w-full p-5 rounded-2xl text-white font-bold text-lg shadow-2xl relative overflow-hidden group animate-pulse-soft"
        style={{
          background: "linear-gradient(135deg, #dc2626, #ec4899, #f472b6, #a855f7)",
          animation: "pulse-soft 2s infinite ease-in-out",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/50 to-purple-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <span className="relative z-10 flex items-center justify-center gap-2">
          <Crown className="w-5 h-5" />
          Aceptar Invitación
          <ChevronRight className="w-5 h-5" />
        </span>
      </motion.button>

      <motion.p
        className="text-white/50 text-xs text-center mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Oferta válida por tiempo limitado
      </motion.p>
    </div>
  )
}

// Enhanced Rejection Card Component
function RejectionCard({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center"
      >
        <XCircle className="w-10 h-10 text-white" />
      </motion.div>

      <div className="text-3xl font-bold mb-6">
        <span className="text-white">Conexión</span>
        <span className="ml-1 bg-gradient-to-r from-pink-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
          Madura
        </span>
      </div>

      <h2 className="text-white text-2xl font-bold mb-4">Lo sentimos</h2>
      <p className="text-white/70 leading-relaxed mb-8 text-lg">
        Parece que esta aplicación no es para ti en este momento. ¡Gracias por tu tiempo!
      </p>

      <motion.button
        onClick={onRestart}
        className="w-full p-4 rounded-2xl text-white font-semibold text-lg bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 transition-all duration-300 shadow-lg"
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        Intentar de nuevo
      </motion.button>
    </div>
  )
}

// Enhanced Benefit Item Component - Adjusted for smaller size
function BenefitItem({
  icon,
  text,
  delay = 0,
}: {
  icon: React.ReactNode
  text: string
  delay?: number
}) {
  return (
    <motion.div
      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white">{icon}</div>
      <span className="text-white/90 font-medium text-sm">{text}</span>
    </motion.div>
  )
}
