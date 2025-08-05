"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Mail, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ExclusivePopup } from "@/components/exclusive-popup"

// Custom Android Icon Component
const AndroidIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1367 1.0989L4.841 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3435-4.1021-2.6892-7.5743-6.1185-9.4396" />
  </svg>
)

// Custom Apple Icon Component
const AppleIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
)

interface LoginScreenProps {
  onNavigate: (
    screen: "home" | "login" | "registration" | "profile-setup" | "welcome" | "discover" | "chat" | "upsell1",
    chatId?: string,
  ) => void
}

export default function LoginScreen({ onNavigate }: LoginScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showTermsWarning, setShowTermsWarning] = useState(false)
  const [showExclusivePopup, setShowExclusivePopup] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Show exclusive popup after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowExclusivePopup(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleLogin = () => {
    if (!termsAccepted) {
      setShowTermsWarning(true)
      return
    }
    setShowTermsWarning(false)
    setIsLoading(true)

    // Simulate login process
    setTimeout(() => {
      // Check if profile is complete
      let isProfileComplete = false
      try {
        const name = localStorage.getItem("userProfileName")
        const photo = localStorage.getItem("userProfilePhotoDataUrl")
        const description = localStorage.getItem("userProfileDescription")
        const interestsRaw = localStorage.getItem("userProfileInterests")
        const interests = interestsRaw ? JSON.parse(interestsRaw) : []

        if (name && name.trim() !== "" && photo && description && description.trim() !== "" && interests.length >= 3) {
          isProfileComplete = true
        }
      } catch (error) {
        console.error("Error checking profile completeness in localStorage:", error)
        isProfileComplete = false
      }

      // Navigate based on profile completeness
      if (isProfileComplete) {
        onNavigate("discover")
      } else {
        onNavigate("profile-setup")
      }
    }, 1500)
  }

  const handleTermsChange = (checked: boolean | "indeterminate") => {
    setTermsAccepted(Boolean(checked))
    if (Boolean(checked)) {
      setShowTermsWarning(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-[#E469B3]/20 flex flex-col items-center justify-center p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        className="mb-6 sm:mb-8"
      >
        <Image
          src="/original-logo.png"
          alt="Conexión Madura Logo"
          width={128}
          height={128}
          className="object-contain"
          priority
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-neutral-900/70 backdrop-blur-md border border-neutral-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-[#E469B3]/10">
          <div className="text-center mb-4">
            <h1 className="text-3xl sm:text-4xl font-bold">
              <span className="text-[#E469B3]">Conexión</span>
              <span className="text-white">Madura</span>
            </h1>
          </div>
          <p className="text-gray-300 text-center text-sm mb-6 sm:mb-8 leading-relaxed">
            Introduce la dirección de correo electrónico utilizada en el momento de la compra.
          </p>

          {/* Email Input */}
          <div className="relative mb-4">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Mail className="h-5 w-5 text-[#E469B3]" />
            </div>
            <Input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12 bg-neutral-800/80 border-neutral-700 text-white placeholder-neutral-400 h-12 rounded-lg focus:border-[#E469B3] focus:ring-2 focus:ring-[#E469B3]/50 transition-all duration-150"
            />
          </div>

          {/* Password Input */}
          <div className="relative mb-6">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-12 bg-neutral-800/80 border-neutral-700 text-white placeholder-neutral-400 h-12 rounded-lg focus:border-[#E469B3] focus:ring-2 focus:ring-[#E469B3]/50 transition-all duration-150"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#E469B3] transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <Button
            onClick={handleLogin}
            disabled={!termsAccepted || isLoading}
            className="w-full bg-[#E469B3] hover:bg-[#D55AA4] text-white font-semibold h-12 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-[#E469B3]/40 disabled:bg-neutral-700 disabled:text-neutral-500 disabled:cursor-not-allowed mb-5"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Iniciando sesión...
              </div>
            ) : (
              "Para Entrar"
            )}
          </Button>

          {/* Terms of Use Checkbox */}
          <div className="flex items-start space-x-2.5">
            <Checkbox
              id="terms-checkbox"
              checked={termsAccepted}
              onCheckedChange={handleTermsChange}
              className="mt-0.5 border-neutral-600 data-[state=checked]:bg-[#E469B3] data-[state=checked]:border-[#E469B3] focus-visible:ring-[#E469B3]"
              aria-label="Aceptar términos de uso"
            />
            <label htmlFor="terms-checkbox" className="text-xs text-neutral-300 leading-normal select-none">
              Para utilizar la aplicación debes leer y aceptar los{" "}
              <a
                href="https://terminosdeusoconexionmadura.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E469B3] hover:text-[#D55AA4] underline hover:no-underline transition-colors"
              >
                términos de uso
              </a>
              .
            </label>
          </div>

          {/* Warning Message */}
          {showTermsWarning && (
            <p className="mt-2 text-xs text-red-400 text-center">
              Por favor, acepta los términos de uso para continuar.
            </p>
          )}
        </div>

        {/* App Store Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="flex justify-center items-center space-x-6 mt-4"
        >
          {/* Android Icon */}
          <div className="relative group">
            <div className="absolute inset-0 bg-green-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative w-10 h-10 bg-gradient-to-br from-neutral-800/60 to-neutral-700/60 backdrop-blur-sm border border-neutral-600/50 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:border-green-500/50 group-hover:shadow-lg group-hover:shadow-green-500/25">
              <AndroidIcon className="w-5 h-5 text-green-400" />
            </div>
          </div>

          {/* Apple Icon */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gray-400/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative w-10 h-10 bg-gradient-to-br from-neutral-800/60 to-neutral-700/60 backdrop-blur-sm border border-neutral-600/50 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:border-gray-400/50 group-hover:shadow-lg group-hover:shadow-gray-400/25">
              <AppleIcon className="w-5 h-5 text-gray-300" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Exclusive Popup */}
      <AnimatePresence>
        {showExclusivePopup && (
          <ExclusivePopup isOpen={showExclusivePopup} onClose={() => setShowExclusivePopup(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
