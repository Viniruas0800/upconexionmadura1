"use client"
import { useState, useEffect } from "react"
import type React from "react"
import Head from "next/head"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronRight,
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

interface QuizScreenProps {
  onNavigate: (
    screen: "home" | "login" | "registration" | "profile-setup" | "welcome" | "discover" | "chat" | "upsell1",
    chatId?: string,
  ) => void
}

export default function QuizScreen({ onNavigate }: QuizScreenProps) {
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
    onNavigate("home")
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
        <title>Evaluación de Elegibilidad - Conexión Madura</title>
        <meta name="description" content="Completa nuestra evaluación para acceder a la aplicación" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
        <div className="relative min-h-screen flex flex-col">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-[#E469B3]/10 blur-xl opacity-30" />
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-[#E469B3]/10 blur-xl opacity-30" />
            <div className="absolute top-3/4 left-1/2 w-24 h-24 rounded-full bg-[#E469B3]/10 blur-xl opacity-30" />
          </div>

          <div className="relative z-10 flex-1 flex flex-col">
            {/* Header */}
            <div className="text-center pt-8 pb-6 px-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 bg-[#E469B3]/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                  <Crown className="w-5 h-5 text-[#E469B3]" />
                  <span className="text-sm font-medium text-[#E469B3]">Evaluación Exclusiva</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                  <span className="text-[#E469B3]">Conexión</span>
                  <span className="text-white">Madura</span>
                </h1>
                <p className="text-gray-300 text-sm">Evaluación de Elegibilidad</p>
              </motion.div>
            </div>

            {/* Progress Bar */}
            {!showResult && !showRejection && (
              <motion.div
                className="px-6 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Progreso</span>
                  <span className="text-sm text-[#E469B3] font-medium">{currentStep}/3</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#E469B3] to-[#D55AA4] rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${getProgressPercentage()}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            )}

            {/* Main Content */}
            <div className="flex-1 px-4 pb-8">
              <AnimatePresence mode="wait">
                {!showResult && !showRejection && currentQuizData && (
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-md mx-auto"
                  >
                    {/* Question */}
                    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-700/50">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E469B3]/20 flex items-center justify-center">
                          <span className="text-[#E469B3] font-bold text-sm">{currentStep}</span>
                        </div>
                        <h2 className="text-lg font-semibold text-white leading-relaxed">{currentQuizData.question}</h2>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                      {currentQuizData.options.map((option) => (
                        <motion.button
                          key={option.id}
                          onClick={() => handleOptionSelect(option.id)}
                          className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                            selectedOption === option.id
                              ? "border-[#E469B3] bg-[#E469B3]/10 shadow-lg shadow-[#E469B3]/20"
                              : "border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800/70"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex-shrink-0 p-2 rounded-lg ${
                                selectedOption === option.id ? "bg-[#E469B3] text-white" : "bg-gray-700 text-gray-300"
                              }`}
                            >
                              {option.icon}
                            </div>
                            <span
                              className={`font-medium ${selectedOption === option.id ? "text-white" : "text-gray-300"}`}
                            >
                              {option.text}
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Success Result */}
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md mx-auto text-center"
                  >
                    <div className="bg-gradient-to-b from-green-900/30 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30"
                      >
                        <CheckCircle className="w-10 h-10 text-white" />
                      </motion.div>

                      <h2 className="text-2xl font-bold text-white mb-4">¡Felicitaciones!</h2>
                      <p className="text-gray-300 mb-6 leading-relaxed">
                        Has sido <span className="text-green-400 font-semibold">aprobado</span> para acceder a nuestra
                        aplicación exclusiva.
                      </p>

                      {/* Progress Animation */}
                      <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">Configurando tu acceso</span>
                          <span className="text-sm text-green-400 font-medium">{progressAnimated ? "100%" : "0%"}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: progressAnimated ? "100%" : "0%" }}
                            transition={{ duration: 2, ease: "easeOut" }}
                          />
                        </div>
                      </div>

                      {/* Benefits */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-left">
                          <Users className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="text-sm text-gray-300">Acceso a mujeres maduras verificadas</span>
                        </div>
                        <div className="flex items-center gap-3 text-left">
                          <MessageCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="text-sm text-gray-300">Gana dinero por cada interacción</span>
                        </div>
                        <div className="flex items-center gap-3 text-left">
                          <Award className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="text-sm text-gray-300">Programa de recompensas exclusivo</span>
                        </div>
                      </div>

                      <motion.button
                        onClick={handleAcceptInvitation}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-green-500/30"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="flex items-center justify-center gap-2">
                          Acceder a la Aplicación
                          <ChevronRight className="w-5 h-5" />
                        </span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Rejection Result */}
                {showRejection && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md mx-auto text-center"
                  >
                    <div className="bg-gradient-to-b from-red-900/30 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-red-500/30">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30"
                      >
                        <XCircle className="w-10 h-10 text-white" />
                      </motion.div>

                      <h2 className="text-2xl font-bold text-white mb-4">Lo sentimos</h2>
                      <p className="text-gray-300 mb-6 leading-relaxed">
                        Basado en tus respuestas, no cumples con los requisitos para acceder a nuestra aplicación en
                        este momento.
                      </p>

                      <motion.button
                        onClick={handleRestart}
                        className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-4 rounded-xl transition-all duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Intentar de Nuevo
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="text-center px-4 pb-6">
              <p className="text-xs text-gray-500">
                Esta evaluación nos ayuda a mantener una comunidad segura y de calidad
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
