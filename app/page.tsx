"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Import all screen components
import LoginScreen from "@/components/screens/login-screen"
import RegistrationScreen from "@/components/screens/registration-screen"
import ProfileSetupScreen from "@/components/screens/profile-setup-screen"
import WelcomeScreen from "@/components/screens/welcome-screen"
import DiscoverScreen from "@/components/screens/discover-screen"
import ChatScreen from "@/components/screens/chat-screen"
import QuizScreen from "@/components/screens/quiz-screen"
import Upsell1Screen from "@/components/screens/upsell1-screen"

// Define all possible screens
type ScreenType =
  | "home"
  | "login"
  | "registration"
  | "profile-setup"
  | "welcome"
  | "discover"
  | "chat"
  | "quiz"
  | "upsell1"

interface AppState {
  currentScreen: ScreenType
  chatId?: string
  urlParams: URLSearchParams
}

// Central Screen Controller Component
export default function HomePage() {
  const [appState, setAppState] = useState<AppState>({
    currentScreen: "home",
    urlParams: new URLSearchParams(),
  })

  // Initialize app state from URL parameters on first load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)

    // Determine initial screen based on URL parameters or localStorage
    let initialScreen: ScreenType = "home"

    // Check if user has completed profile setup
    try {
      const savedProfile = localStorage.getItem("userProfile")
      const hasVisitedDiscover = localStorage.getItem("hasVisitedDiscover")

      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile)
        const name = parsedProfile.name
        const photos = parsedProfile.photos
        const interests = parsedProfile.interests

        if (name && photos && photos.length > 0 && interests && interests.length >= 3) {
          // Profile is complete
          if (hasVisitedDiscover === "true") {
            initialScreen = "discover"
          } else {
            initialScreen = "discover"
          }
        } else {
          initialScreen = "profile-setup"
        }
      }
    } catch (error) {
      console.error("Error checking profile completeness:", error)
    }

    setAppState({
      currentScreen: initialScreen,
      urlParams,
    })
  }, [])

  // Navigation function to replace router.push()
  const navigateToScreen = (screen: ScreenType, chatId?: string) => {
    setAppState((prev) => ({
      ...prev,
      currentScreen: screen,
      chatId,
    }))
  }

  // Render current screen based on state
  const renderCurrentScreen = () => {
    switch (appState.currentScreen) {
      case "home":
        return <LoginScreen onNavigate={navigateToScreen} />

      case "login":
        return <LoginScreen onNavigate={navigateToScreen} />

      case "registration":
        return <RegistrationScreen onNavigate={navigateToScreen} />

      case "profile-setup":
        return <ProfileSetupScreen onNavigate={navigateToScreen} />

      case "welcome":
        return <WelcomeScreen onNavigate={navigateToScreen} />

      case "discover":
        return <DiscoverScreen onNavigate={navigateToScreen} />

      case "chat":
        return <ChatScreen onNavigate={navigateToScreen} chatId={appState.chatId} />

      case "quiz":
        return <QuizScreen onNavigate={navigateToScreen} />

      case "upsell1":
        return <Upsell1Screen onNavigate={navigateToScreen} />

      default:
        return <LoginScreen onNavigate={navigateToScreen} />
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={appState.currentScreen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderCurrentScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
