"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, CheckCircle, ChevronRight, Bell, Star, Clock } from "lucide-react"
import { useViewportHeight } from "@/hooks/use-viewport-height"
import { SuccessPopup } from "@/components/success-popup"
import { ConfettiAnimation } from "@/components/confetti-animation"

interface UserProfile {
  name: string
  photos: string[]
  interests: string[]
}

interface WelcomeScreenProps {
  onNavigate: (
    screen: "home" | "login" | "registration" | "profile-setup" | "welcome" | "discover" | "chat" | "upsell1",
    chatId?: string,
  ) => void
}

export default function WelcomeScreen({ onNavigate }: WelcomeScreenProps) {
  useViewportHeight()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [currentTip, setCurrentTip] = useState(0)

  const tips = [
    {
      title: "DISFRUTA TODAS LAS FOTOS",
      icon: <Heart className="h-6 w-6 text-white" />,
      description:
        "Mientras más perfiles disfrutes, mayores serán tus posibilidades de recibir pagos. ¡No pierdas tiempo!",
      color: "from-purple-500 to-purple-700",
      emoji: "🔥",
    },
    {
      title: "RESPONDE RÁPIDO",
      icon: <Bell className="h-6 w-6 text-white" />,
      description: "Los usuarios activos reciben 3 veces más dinero que aquellos que se demoran en responder.",
      color: "from-purple-500 to-purple-700",
      emoji: "⚡",
    },
    {
      title: "RECIBE REGALOS",
      icon: <Star className="h-6 w-6 text-white" />,
      description: "Las mujeres maduras aman enviar pequeños regalos a los hombres que las hacen sentir especiales.",
      color: "from-purple-500 to-purple-700",
      emoji: "💰",
    },
  ]

  useEffect(() => {
    try {
      document.body.classList.add("overflow-hidden")

      // Load user profile data
      const savedProfile = localStorage.getItem("userProfile")
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile)
        setProfile(parsedProfile)
      } else {
        // Fallback to individual localStorage items
        const name = localStorage.getItem("userName") || "Usuario"
        const photo = localStorage.getItem("userPhoto")
        const interests = localStorage.getItem("userInterests")

        setProfile({
          name,
          photos: photo ? [photo] : [],
          interests: interests ? JSON.parse(interests) : [],
        })
      }

      // Start the sequence: loading -> confetti -> popup
      const loadingTimer = setTimeout(() => {
        setLoading(false)
        setShowConfetti(true)
      }, 1500)

      // Show popup after confetti
      const popupTimer = setTimeout(() => {
        setShowSuccessPopup(true)
      }, 4000) // 1.5s loading + 2.5s confetti

      // Rotate tips
      const tipInterval = setInterval(() => {
        setCurrentTip((prev) => (prev + 1) % 3)
      }, 5000)

      return () => {
        clearTimeout(loadingTimer)
        clearTimeout(popupTimer)
        clearInterval(tipInterval)
        document.body.classList.remove("overflow-hidden")
      }
    } catch (error) {
      console.error("Error in bem-vindo page:", error)
    }
  }, [])

  const handleGetStarted = () => {
    setLoading(true)
    setTimeout(() => {
      onNavigate("discover")
    }, 1500)
  }

  const handleStartEarning = () => {
    setShowSuccessPopup(false)
    setLoading(true)
    setTimeout(() => {
      onNavigate("discover")
    }, 1000)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black p-6">
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="mb-6"
          >
            <Heart className="h-12 w-12 text-[#E469B3]" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-lg font-medium text-white">Preparando tu experiencia...</p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div
        className="flex flex-col items-center justify-between bg-black relative overflow-y-auto overflow-x-hidden"
        style={{ minHeight: "100dvh", width: "100%", maxWidth: "100%", touchAction: "pan-y" }}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#E469B3]/20 via-black to-black" />
          <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-[#E469B3]/10 blur-xl opacity-20" />
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-[#E469B3]/10 blur-xl opacity-20" />
          <div className="absolute top-3/4 left-1/2 w-24 h-24 rounded-full bg-[#E469B3]/10 blur-xl opacity-20" />
        </div>

        {/* Confetti Animation */}
        <AnimatePresence>
          {showConfetti && <ConfettiAnimation onComplete={() => setShowConfetti(false)} />}
        </AnimatePresence>

        <div className="w-full max-w-md z-10 flex flex-col h-full justify-between py-safe overflow-x-hidden">
          {/* Header Section */}
          <div className="mb-4 pt-4">
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Profile Picture */}
              <div className="relative mb-4">
                <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-[#E469B3] shadow-lg shadow-[#E469B3]/20 relative">
                  {profile?.photos?.[0] ? (
                    <Image
                      src={profile.photos[0] || "/placeholder.svg"}
                      alt="Tu perfil"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        console.error("User photo failed to load")
                        e.currentTarget.src = "/placeholder.svg"
                      }}
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-800 flex items-center justify-center">
                      <span className="text-3xl text-gray-400">👤</span>
                    </div>
                  )}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[#E469B3]"
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.05, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  />
                </div>
                <motion.div
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-green-500 flex items-center justify-center border-2 border-black"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <CheckCircle className="h-5 w-5 text-black" />
                </motion.div>
              </div>

              {/* Welcome Text */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h1 className="text-center text-3xl font-bold text-white mb-1">
                  ¡Bienvenido, <span className="text-[#E469B3]">{profile?.name || "Usuario"}</span>!
                </h1>
                <h2 className="text-center text-xl font-bold text-white mb-4">
                  a <span className="text-[#E469B3]">Conexión</span>Madura
                </h2>
              </motion.div>
            </motion.div>

            {/* Stats Bar */}
            <motion.div
              className="flex justify-between items-center bg-gray-900/50 rounded-xl p-3 mb-6 border border-[#E469B3]/20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 mb-1">
                  <Heart className="h-4 w-4 text-[#E469B3]" fill="#E469B3" />
                  <span className="text-white font-bold">100%</span>
                </div>
                <span className="text-xs text-gray-400">Match</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 mb-1">
                  <Clock className="h-4 w-4 text-[#E469B3]" />
                  <span className="text-white font-bold">24h</span>
                </div>
                <span className="text-xs text-gray-400">Activo</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="h-4 w-4 text-yellow-500" fill="#eab308" />
                  <span className="text-white font-bold">VIP</span>
                </div>
                <span className="text-xs text-gray-400">Estado</span>
              </div>
            </motion.div>
          </div>

          {/* Tips Section */}
          <motion.div
            className="flex-1 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h3 className="text-center text-lg font-medium text-white mb-6">Maximiza tus posibilidades de éxito:</h3>

            <div className="relative h-[180px] sm:h-[200px] mb-4">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tip.color} p-5 shadow-lg transition-all duration-300 ease-in-out ${
                    currentTip === index
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-full pointer-events-none"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0 rounded-full bg-white/20 p-3">{tip.icon}</div>
                    <div>
                      <h3 className="font-bold text-white flex items-center text-xl">
                        {tip.title}
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatDelay: 1,
                          }}
                          className="ml-2"
                        >
                          {tip.emoji}
                        </motion.div>
                      </h3>
                      <p className="text-white/90 mt-2 leading-relaxed">{tip.description}</p>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {[0, 1, 2].map((i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentTip(i)}
                        className={`h-2 rounded-full transition-all ${
                          currentTip === i ? "w-6 bg-white" : "w-2 bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Online Users */}
            <motion.div
              className="flex justify-center items-center gap-2 text-gray-400 text-sm mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <motion.span
                initial={{ opacity: 1 }}
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                1247 usuarios en línea ahora
              </motion.span>
            </motion.div>
          </motion.div>

          {/* CTA Button */}
          <div className="space-y-3 sm:space-y-4 mb-2 sm:mb-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#E469B3] to-[#D55AA4] rounded-lg blur-xl opacity-50" />
                <Button
                  onClick={handleGetStarted}
                  className="w-full bg-gradient-to-r from-[#E469B3] to-[#D55AA4] py-7 text-lg font-bold hover:from-[#D55AA4] hover:to-[#E469B3] relative z-10 rounded-full"
                >
                  <span className="relative z-10 flex items-center">
                    EMPEZAR AHORA
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </span>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Success Popup */}
        <AnimatePresence>{showSuccessPopup && <SuccessPopup onStartEarning={handleStartEarning} />}</AnimatePresence>
      </div>
    </div>
  )
}
