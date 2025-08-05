"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useViewportHeight } from "@/hooks/use-viewport-height"
import { ImageBankManager } from "@/lib/image-bank-manager"
import { useCurrency } from "@/hooks/use-currency"
import { X, MapPin, Crown, Zap } from "lucide-react"
import { RefinedTutorialOverlay } from "@/components/discover/refined-tutorial-overlay"
import { MatchAnimationOverlay } from "@/components/discover/match-animation-overlay"
import { RewardPopup } from "@/components/discover/reward-popup"
import WelcomePopup from "@/components/discover/welcome-popup"
import AutomationSwitch from "@/components/automation-switch"
import { VideoTutorialOverlay } from "@/components/discover/video-tutorial-overlay"
import { SwitchTutorialOverlay } from "@/components/discover/switch-tutorial-overlay"

interface ProfileCard {
  id: number
  name: string
  age: number
  image: string
  distance: string
  isOnline: boolean
  interests: string[]
  bio: string
  hasVideo?: boolean
  videoUrl?: string
}

interface DiscoverScreenProps {
  onNavigate: (
    screen: "home" | "login" | "registration" | "profile-setup" | "welcome" | "discover" | "chat" | "upsell1",
    chatId?: string,
  ) => void
}

// Profile data with image bank integration and video ONLY for second profile (index 1)
const generateProfileData = (): ProfileCard[] => [
  {
    id: 1,
    name: "Isabella",
    age: 34,
    image: ImageBankManager.getNextImage(),
    distance: "A 2 km",
    isOnline: true,
    interests: ["Viajes", "Vino", "Arte"],
    bio: "Empresaria exitosa buscando conexiones genuinas. Me encanta la buena comida y las escapadas de fin de semana.",
  },
  {
    id: 2,
    name: "Sophia",
    age: 38,
    image: ImageBankManager.getNextImage(),
    distance: "A 5 km",
    isOnline: true,
    interests: ["Ejercicio", "Cocina", "Música"],
    bio: "Instructora de yoga y chef. Creo en vivir la vida al máximo y compartir experiencias increíbles.",
    hasVideo: true,
    videoUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/video-new-01-fKEyGGVQRFZQpFmRJDxNuAHKDw4pou.mp4",
  },
  {
    id: 3,
    name: "Victoria",
    age: 31,
    image: ImageBankManager.getNextImage(),
    distance: "A 3 km",
    isOnline: false,
    interests: ["Libros", "Teatro", "Viajes"],
    bio: "Profesora de literatura que ama las conversaciones profundas y explorar nuevas culturas juntos.",
  },
  {
    id: 4,
    name: "Camila",
    age: 36,
    image: ImageBankManager.getNextImage(),
    distance: "A 1 km",
    isOnline: true,
    interests: ["Moda", "Fotografía", "Baile"],
    bio: "Diseñadora de moda con pasión por capturar momentos hermosos y bailar toda la noche.",
  },
  {
    id: 5,
    name: "Natalia",
    age: 33,
    image: ImageBankManager.getNextImage(),
    distance: "A 4 km",
    isOnline: true,
    interests: ["Negocios", "Lujo", "Spa"],
    bio: "CEO que sabe trabajar duro y divertirse más. Busco a alguien para compartir experiencias de lujo.",
  },
  {
    id: 6,
    name: "Gabriela",
    age: 35,
    image: ImageBankManager.getNextImage(),
    distance: "A 6 km",
    isOnline: false,
    interests: ["Arte", "Vino", "Viajes"],
    bio: "Propietaria de galería de arte que aprecia las cosas finas de la vida y las conexiones significativas.",
  },
  {
    id: 7,
    name: "Mariana",
    age: 32,
    image: ImageBankManager.getNextImage(),
    distance: "A 2 km",
    isOnline: true,
    interests: ["Ejercicio", "Aventura", "Comida"],
    bio: "Entrenadora personal que ama las aventuras al aire libre y probar nuevos restaurantes con alguien especial.",
  },
  {
    id: 8,
    name: "Valentina",
    age: 37,
    image: ImageBankManager.getNextImage(),
    distance: "A 3 km",
    isOnline: true,
    interests: ["Música", "Cultura", "Lujo"],
    bio: "Productora musical que disfruta eventos culturales y experiencias de lujo. Creemos hermosos recuerdos juntos.",
  },
  {
    id: 9,
    name: "Fernanda",
    age: 39,
    image: ImageBankManager.getNextImage(),
    distance: "A 5 km",
    isOnline: false,
    interests: ["Negocios", "Viajes", "Bienestar"],
    bio: "Empresaria exitosa que valora el bienestar y los viajes. Busco conexión genuina y aventura.",
  },
  {
    id: 10,
    name: "Carolina",
    age: 30,
    image: ImageBankManager.getNextImage(),
    distance: "A 4 km",
    isOnline: true,
    interests: ["Diseño", "Arte", "Moda"],
    bio: "Diseñadora de interiores con ojo para la belleza y el estilo. Diseñemos momentos hermosos juntos.",
  },
]

// Animated Play Button Component - UPDATED: Larger size and perfect centering, with tutorial highlight
const AnimatedPlayButton = ({ onClick, isTutorialActive }: { onClick: () => void; isTutorialActive: boolean }) => {
  return (
    <div
      className="absolute top-1/2 left-1/2 w-20 h-20 rounded-full bg-white cursor-pointer z-20 flex items-center justify-center"
      style={{
        transform: "translate(-50%, -50%)",
        boxShadow: "0 0 16px rgba(255, 255, 255, 0.5)",
        animation: "pulse 2s infinite ease-in-out",
      }}
      onClick={onClick}
    >
      {/* Existing Ripple effect */}
      <div
        className="absolute inset-0 rounded-full bg-white/30"
        style={{
          animation: "ripple 2s infinite ease-out",
          zIndex: -1,
        }}
      />

      {/* NEW: Tutorial Highlight Effect */}
      {isTutorialActive && (
        <>
          <div
            className="absolute inset-0 rounded-full bg-[#E469B3]/50" // Use app's primary color
            style={{
              animation: "tutorial-pulse 2s infinite ease-out",
              zIndex: -2, // Behind the main button and existing ripple
            }}
          />
          <div
            className="absolute inset-0 rounded-full bg-[#E469B3]/30" // Another layer for a softer glow
            style={{
              animation: "tutorial-pulse 2s 0.5s infinite ease-out", // Slightly delayed
              zIndex: -3,
            }}
          />
        </>
      )}

      {/* Play icon - CSS triangle - UPDATED: Larger size for bigger button */}
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: "16px solid black",
          borderTop: "12px solid transparent",
          borderBottom: "12px solid transparent",
          marginLeft: "3px", // Slight visual offset for triangle centering
        }}
      />
    </div>
  )
}

// Video Player Component - UPDATED: Auto-advance when video ends
const ProfileVideoPlayer = ({
  videoUrl,
  isVisible,
  isRewardPopupVisible,
  onVideoReady,
  onVideoEnded,
  onVideoPausedAfterInitialPlay,
  isTutorialActive, // New prop
}: {
  videoUrl: string
  isVisible: boolean
  isRewardPopupVisible: boolean
  onVideoReady?: () => void
  onVideoEnded?: () => void
  onVideoPausedAfterInitialPlay?: () => void
  isTutorialActive: boolean // New prop
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [showPlayButton, setShowPlayButton] = useState(false)
  const [hasCompletedInitialPlay, setHasCompletedInitialPlay] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load video
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedData = () => {
      setIsLoaded(true)
      if (onVideoReady) onVideoReady()
      console.log("📹 Video loaded and ready")
    }

    const handleError = (e: Event) => {
      console.error("❌ Video loading error:", e)
      setHasError(true)
    }

    const handlePlay = () => {
      setIsPlaying(true)
      console.log("📹 Video started playing")
    }

    const handlePause = () => {
      setIsPlaying(false)
      console.log("📹 Video paused")
    }

    // UPDATED: Handle video end to auto-advance to next profile
    const handleEnded = () => {
      console.log("📹 Video ended - auto-advancing to next profile")
      setIsPlaying(false)
      setShowPlayButton(false)
      if (onVideoEnded) {
        onVideoEnded()
      }
    }

    video.addEventListener("loadeddata", handleLoadedData)
    video.addEventListener("error", handleError)
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("ended", handleEnded)

    // Preload the video
    video.load()

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData)
      video.removeEventListener("error", handleError)
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("ended", handleEnded)
    }
  }, [videoUrl, onVideoReady, onVideoEnded])

  // Handle video playback logic
  useEffect(() => {
    const video = videoRef.current
    if (!video || !isLoaded) return

    // Clear any existing timeout
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current)
      pauseTimeoutRef.current = null
    }

    // Reset states when not visible
    if (!isVisible) {
      video.pause()
      video.currentTime = 0
      setShowPlayButton(false)
      setHasCompletedInitialPlay(false)
      setIsPlaying(false)
      console.log("📹 Video reset - not visible")
      return
    }

    // Don't start if reward popup is visible
    if (isRewardPopupVisible) {
      video.pause()
      setIsPlaying(false)
      console.log("📹 Video paused - reward popup visible")
      return
    }

    // Start initial autoplay only if we haven't completed it yet
    if (isVisible && !isRewardPopupVisible && !hasCompletedInitialPlay) {
      console.log("📹 Starting initial autoplay")
      video.currentTime = 0 // Start from beginning

      video
        .play()
        .then(() => {
          console.log("📹 Initial autoplay started")

          // Set timeout to pause after exactly 1 second
          pauseTimeoutRef.current = setTimeout(() => {
            video.pause()
            setShowPlayButton(true)
            setHasCompletedInitialPlay(true)
            console.log("📹 Video paused after 1 second, showing play button")
            if (onVideoPausedAfterInitialPlay) {
              onVideoPausedAfterInitialPlay() // Trigger tutorial
            }
          }, 1000)
        })
        .catch((error) => {
          console.error("❌ Video autoplay failed:", error)
        })
    }
  }, [isVisible, isRewardPopupVisible, isLoaded, hasCompletedInitialPlay, onVideoPausedAfterInitialPlay])

  // UPDATED: Handle play button click - play to end
  const handlePlayButtonClick = () => {
    const video = videoRef.current
    if (!video) return

    // Clear any existing timeout
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current)
      pauseTimeoutRef.current = null
    }

    // Resume from current position and play to the end
    video
      .play()
      .then(() => {
        console.log("📹 Video resumed - will play to completion")
        setShowPlayButton(false)
        // Video will now play until it ends naturally (handleEnded will be called)
      })
      .catch((error) => {
        console.error("❌ Video resume failed:", error)
      })
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current)
      }
      const video = videoRef.current
      if (video) {
        video.pause()
        video.currentTime = 0
      }
    }
  }, [])

  if (hasError) {
    return (
      <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
        <p className="text-white text-sm">Error loading video</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={videoUrl}
        muted={false} // Audio enabled
        playsInline
        preload="auto"
        style={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
        }}
      />

      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}

      {/* UPDATED: Larger Animated Play Button - perfectly centered */}
      {showPlayButton && hasCompletedInitialPlay && (
        <AnimatedPlayButton onClick={handlePlayButtonClick} isTutorialActive={isTutorialActive} />
      )}
    </div>
  )
}

export default function DiscoverScreen({ onNavigate }: DiscoverScreenProps) {
  useViewportHeight()

  // State management
  const [profiles, setProfiles] = useState<ProfileCard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showWelcomePopup, setShowWelcomePopup] = useState(false)
  const [hasClosedWelcomePopup, setHasClosedWelcomePopup] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [showMatchAnimation, setShowMatchAnimation] = useState(false)
  const [matchedProfile, setMatchedProfile] = useState<ProfileCard | null>(null)
  const [showRewardPopup, setShowRewardPopup] = useState(false)
  const [rewardAmount, setRewardAmount] = useState("0.00")
  const [userStats, setUserStats] = useState({
    likes: 0,
    rejects: 0,
    earnings: 0,
    matches: 0,
  })
  const [userName, setUserName] = useState("Usuario")
  const [userPhoto, setUserPhoto] = useState("/placeholder.svg")
  const [isLoading, setIsLoading] = useState(true)
  const [isFirstTimeVisit, setIsFirstTimeVisit] = useState(true)
  const [isBlocked, setIsBlocked] = useState(false)
  const [showLimitPopup, setShowLimitPopup] = useState(false)
  const [showVipPopup, setShowVipPopup] = useState(false)
  const [showWithdrawalPopup, setShowWithdrawalPopup] = useState(false)

  // Video-specific state
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [showVideoPlayButton, setShowVideoPlayButton] = useState(false) // Track play button visibility

  // Automation state
  const [isAutomationActive, setIsAutomationActive] = useState(false)
  const automationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // New tutorial states
  const [showVideoTutorial, setShowVideoTutorial] = useState(false)
  const [hasSeenVideoTutorial, setHasSeenVideoTutorial] = useState(false)
  const [showSwitchTutorial, setShowSwitchTutorial] = useState(false)
  const [hasSeenSwitchTutorial, setHasSeenSwitchTutorial] = useState(false)

  // Refs
  const cardRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { formatCurrency, isLoaded: currencyLoaded } = useCurrency()

  // Initialize profiles and user data
  useEffect(() => {
    try {
      // Generate profiles with image bank
      const generatedProfiles = generateProfileData()
      setProfiles(generatedProfiles)

      // Check if this is the first time visiting /discover
      const hasVisitedDiscover = localStorage.getItem("hasVisitedDiscover")
      if (hasVisitedDiscover === "true") {
        setIsFirstTimeVisit(false)
        setIsBlocked(true) // Block interactions on subsequent visits until popup is handled
      } else {
        setIsFirstTimeVisit(true)
        // Mark that user has now visited discover
        localStorage.setItem("hasVisitedDiscover", "true")
      }

      // Load user stats
      const savedStats = localStorage.getItem("userStats")
      if (savedStats) {
        const parsedStats = JSON.parse(savedStats)
        setUserStats(parsedStats)
      }

      // Load user name and photo
      const savedProfile = localStorage.getItem("userProfile")
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile)
        if (parsedProfile.name) {
          const firstName = parsedProfile.name.split(" ")[0]
          setUserName(firstName)
        }
        if (parsedProfile.photos && parsedProfile.photos.length > 0) {
          setUserPhoto(parsedProfile.photos[0])
        }
      }

      // Load tutorial seen states from localStorage
      setHasSeenVideoTutorial(localStorage.getItem("hasSeenVideoTutorial") === "true")
      setHasSeenSwitchTutorial(localStorage.getItem("hasSeenSwitchTutorial") === "true")

      // Show welcome popup first (only on first visit)
      const hasSeenWelcomePopup = localStorage.getItem("hasSeenWelcomePopup")
      if (!hasSeenWelcomePopup && isFirstTimeVisit) {
        setTimeout(() => {
          setShowWelcomePopup(true)
        }, 1000)
      } else {
        // If welcome popup was already seen, mark as closed and check for tutorial
        setHasClosedWelcomePopup(true)
        const hasSeenTutorial = localStorage.getItem("hasSeenTutorial")
        if (!hasSeenTutorial && isFirstTimeVisit) {
          setTimeout(() => {
            setShowTutorial(true)
          }, 1000)
        }
      }

      setIsLoading(false)
    } catch (error) {
      console.error("Error initializing discover page:", error)
      setIsLoading(false)
    }
  }, [isFirstTimeVisit])

  // Effect to show tutorial after welcome popup is closed
  useEffect(() => {
    if (hasClosedWelcomePopup && isFirstTimeVisit) {
      const hasSeenTutorial = localStorage.getItem("hasSeenTutorial")
      if (!hasSeenTutorial) {
        // Small delay to ensure smooth transition
        const timer = setTimeout(() => {
          setShowTutorial(true)
        }, 500)
        return () => clearTimeout(timer)
      }
    }
  }, [hasClosedWelcomePopup, isFirstTimeVisit])

  // Save user stats to localStorage
  const saveUserStats = useCallback((stats: typeof userStats) => {
    try {
      localStorage.setItem("userStats", JSON.stringify(stats))
      setUserStats(stats)
    } catch (error) {
      console.error("Error saving user stats:", error)
    }
  }, [])

  // Core automation logic - automatic like loop
  const executeAutomaticLike = useCallback(() => {
    // If automation is no longer active, stop the loop.
    if (!isAutomationActive) {
      console.log("🤖 Automation deactivated during loop, stopping.")
      return
    }

    // If an animation is in progress, or a blocking popup is open, wait and retry.
    // Note: Tutorial overlays (showVideoTutorial, showSwitchTutorial) do NOT block automation.
    if (isAnimating || showWelcomePopup || showTutorial) {
      console.log("🤖 Blocking condition detected, waiting...")
      automationTimeoutRef.current = setTimeout(executeAutomaticLike, 500) // Retry quickly
      return
    }

    // If reward popup is visible, auto-close it and retry.
    if (showRewardPopup) {
      console.log("🤖 Auto-closing reward popup.")
      setShowRewardPopup(false)
      automationTimeoutRef.current = setTimeout(executeAutomaticLike, 500) // Give it a moment to close
      return
    }

    // If no more profiles, stop automation.
    if (currentIndex >= profiles.length) {
      console.log("🤖 No more profiles, stopping automation.")
      setIsAutomationActive(false) // Ensure switch is off if loop ends naturally
      if (automationTimeoutRef.current) {
        clearTimeout(automationTimeoutRef.current)
        automationTimeoutRef.current = null
      }
      return
    }

    // --- Core Like Logic ---
    console.log("🤖 Executing automatic like for profile:", profiles[currentIndex]?.name)
    setIsAnimating(true) // Start card animation

    const currentProfile = profiles[currentIndex]
    // No need to explicitly stop video here, ProfileVideoPlayer handles it when isAnimating becomes true.

    const randomCommission = (Math.random() * 20 + 10).toFixed(2)
    const newStats = {
      ...userStats,
      likes: userStats.likes + 1,
      earnings: userStats.earnings + Number.parseFloat(randomCommission),
      matches: userStats.matches + (userStats.likes + 1 === 6 ? 1 : 0),
    }
    saveUserStats(newStats)

    setRewardAmount(randomCommission)
    setShowRewardPopup(true) // Show reward popup

    // Match logic (6th like) - only on first visit
    if (isFirstTimeVisit && newStats.likes === 6) {
      console.log("🤖 Match detected! Stopping automation for match animation.")
      setIsAutomationActive(false) // Stop automation
      // Store matched profile data
      try {
        localStorage.setItem("matchedProfileName", currentProfile.name)
        localStorage.setItem("matchedProfilePhoto", currentProfile.image)
        localStorage.setItem("matchedProfileAge", currentProfile.age.toString())
        localStorage.setItem("matchedProfileBio", currentProfile.bio)
        localStorage.setItem("matchedProfileInterests", JSON.stringify(currentProfile.interests))
      } catch (error) {
        console.error("Error storing matched profile data:", error)
      }

      setTimeout(() => {
        setShowRewardPopup(false) // Ensure reward popup is closed before match animation
        setMatchedProfile(currentProfile)
        setShowMatchAnimation(true)

        setTimeout(() => {
          setShowMatchAnimation(false)
          onNavigate("chat", currentProfile.id.toString())
        }, 3000) // Delay for match animation
      }, 2000) // Delay before match animation starts (after reward popup)
      return // Exit, as automation is now off and redirection will happen
    }

    // Advance to next profile and schedule next like
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1)
      setIsAnimating(false) // End card animation
      setIsVideoReady(false) // Reset video ready state for next profile

      // Schedule the next iteration of the loop
      if (isAutomationActive && currentIndex + 1 < profiles.length) {
        // Check if automation is still active and profiles remain
        automationTimeoutRef.current = setTimeout(executeAutomaticLike, 2000) // Delay before next like
      } else if (isAutomationActive && currentIndex + 1 >= profiles.length) {
        // If automation is active but no more profiles, turn off automation
        setIsAutomationActive(false)
        if (automationTimeoutRef.current) {
          clearTimeout(automationTimeoutRef.current)
          automationTimeoutRef.current = null
        }
        console.log("🤖 Automation stopped: No more profiles to like.")
      }
    }, 1000) // Delay for card animation to complete
  }, [
    isAutomationActive,
    isAnimating,
    showRewardPopup,
    showWelcomePopup,
    showTutorial,
    currentIndex,
    profiles,
    userStats,
    isFirstTimeVisit,
    saveUserStats,
    onNavigate,
    setShowRewardPopup,
    setIsAnimating,
    setCurrentIndex,
    setRewardAmount,
    setMatchedProfile,
    setShowMatchAnimation,
    setIsVideoReady,
    setIsAutomationActive,
  ])

  // Effect to start/stop automation loop based on isAutomationActive state and currentIndex
  useEffect(() => {
    if (isAutomationActive && currentIndex >= 2) {
      // Only start if active AND on/after third profile
      console.log("🤖 Automation activated, initiating first automatic like...")
      // Clear any existing timeout before starting a new loop
      if (automationTimeoutRef.current) {
        clearTimeout(automationTimeoutRef.current)
        automationTimeoutRef.current = null
      }
      automationTimeoutRef.current = setTimeout(executeAutomaticLike, 1000) // Initial delay
    } else {
      console.log("🤖 Automation deactivated or not yet enabled, clearing any pending automatic likes.")
      if (automationTimeoutRef.current) {
        clearTimeout(automationTimeoutRef.current)
        automationTimeoutRef.current = null
      }
    }
    // Cleanup function to clear timeout if component unmounts or dependencies change
    return () => {
      if (automationTimeoutRef.current) {
        clearTimeout(automationTimeoutRef.current)
      }
    }
  }, [isAutomationActive, currentIndex, executeAutomaticLike]) // Depend on isAutomationActive, currentIndex, and the callback itself

  // Handle automation toggle
  const handleAutomationToggle = useCallback(
    (active: boolean) => {
      // Prevent activation before third profile (index 2)
      if (active && currentIndex < 2) {
        console.log("🤖 Automation blocked - not yet at third profile")
        return
      }

      console.log(`🤖 Automation switch toggled to: ${active}`)
      setIsAutomationActive(active)

      // If switch tutorial is visible and being toggled ON, close it and start automation
      if (showSwitchTutorial && active) {
        setShowSwitchTutorial(false)
        setHasSeenSwitchTutorial(true)
        localStorage.setItem("hasSeenSwitchTutorial", "true")
        // Automation will start via the useEffect that watches isAutomationActive
      }
    },
    [currentIndex, showSwitchTutorial],
  )

  // Auto-disable automation if user goes back before third profile
  useEffect(() => {
    if (isAutomationActive && currentIndex < 2) {
      console.log("🤖 Auto-disabling automation - moved before third profile")
      setIsAutomationActive(false) // This will trigger the main useEffect to clear the timeout
    }
  }, [currentIndex, isAutomationActive])

  // Logic to trigger Video Tutorial Overlay
  const handleVideoPausedAfterInitialPlay = useCallback(() => {
    setShowVideoPlayButton(true) // Ensure the play button is visible
    if (currentIndex === 1 && !hasSeenVideoTutorial) {
      setShowVideoTutorial(true)
    }
  }, [currentIndex, hasSeenVideoTutorial])

  // Logic to trigger Switch Button Tutorial Overlay - UPDATED: Only show after reward popup is closed
  useEffect(() => {
    if (currentIndex === 2 && !hasSeenSwitchTutorial && !showRewardPopup) {
      // Small delay to ensure the switch button is fully rendered and enabled
      const timer = setTimeout(() => {
        setShowSwitchTutorial(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, hasSeenSwitchTutorial, showRewardPopup]) // Added showRewardPopup to dependencies

  // Handle video ended - auto-advance to next profile
  const handleVideoEnded = useCallback(() => {
    console.log("🎬 Video ended - auto-advancing to next profile")
    setIsAnimating(true)
    setShowVideoTutorial(false) // Close video tutorial if open
    setHasSeenVideoTutorial(true)
    localStorage.setItem("hasSeenVideoTutorial", "true")

    // Generate randomized commission amount between $10.00-$30.00
    const randomCommission = (Math.random() * 20 + 10).toFixed(2)

    // Update stats as if user liked the profile
    const newStats = {
      ...userStats,
      likes: userStats.likes + 1,
      earnings: userStats.earnings + Number.parseFloat(randomCommission),
      matches: userStats.matches + (userStats.likes + 1 === 6 ? 1 : 0),
    }
    saveUserStats(newStats)

    // Show reward popup with randomized amount
    setRewardAmount(randomCommission)
    setShowRewardPopup(true)

    // Match logic (6th like) - only on first visit
    if (isFirstTimeVisit && newStats.likes === 6) {
      const currentProfile = profiles[currentIndex]
      // Store matched profile data for chat
      try {
        localStorage.setItem("matchedProfileName", currentProfile.name)
        localStorage.setItem("matchedProfilePhoto", currentProfile.image)
        localStorage.setItem("matchedProfileAge", currentProfile.age.toString())
        localStorage.setItem("matchedProfileBio", currentProfile.bio)
        localStorage.setItem("matchedProfileInterests", JSON.stringify(currentProfile.interests))
      } catch (error) {
        console.error("Error storing matched profile data:", error)
      }

      setTimeout(() => {
        setShowRewardPopup(false)
        setMatchedProfile(currentProfile)
        setShowMatchAnimation(true)

        setTimeout(() => {
          setShowMatchAnimation(false)
          onNavigate("chat", currentProfile.id.toString())
        }, 3000)
      }, 2000)
    }

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1)
      setIsAnimating(false)
      setIsVideoReady(false) // Reset video ready state for next profile
      setShowVideoPlayButton(false) // Hide play button for next profile
    }, 500)
  }, [userStats, isFirstTimeVisit, profiles, currentIndex, saveUserStats, onNavigate])

  // Handle welcome popup close
  const handleWelcomePopupClose = useCallback(() => {
    setShowWelcomePopup(false)
    setHasClosedWelcomePopup(true)
    localStorage.setItem("hasSeenWelcomePopup", "true")
  }, [])

  // Handle welcome popup try pro
  const handleWelcomePopupTryPro = useCallback(() => {
    setShowWelcomePopup(false)
    setHasClosedWelcomePopup(true)
    localStorage.setItem("hasSeenWelcomePopup", "true")
  }, [])

  // Handle like action with new popup behavior and video stopping
  const handleLike = useCallback(() => {
    if (isAnimating || currentIndex >= profiles.length) return

    // Don't allow manual skips when automation is active
    if (isAutomationActive) {
      console.log("🤖 Manual like blocked - automation is active")
      return
    }

    // Stop video immediately if current profile has video
    const currentProfile = profiles[currentIndex]
    if (currentProfile?.hasVideo) {
      console.log("🛑 Stopping video due to like action")
    }

    setIsAnimating(true)

    // Generate randomized commission amount between $10.00-$30.00
    const randomCommission = (Math.random() * 20 + 10).toFixed(2)

    // Update stats
    const newStats = {
      ...userStats,
      likes: userStats.likes + 1,
      earnings: userStats.earnings + Number.parseFloat(randomCommission),
      matches: userStats.matches + (userStats.likes + 1 === 6 ? 1 : 0),
    }
    saveUserStats(newStats)

    // Show reward popup with randomized amount
    setRewardAmount(randomCommission)
    setShowRewardPopup(true)

    // Match logic (6th like) - only on first visit
    if (isFirstTimeVisit && newStats.likes === 6) {
      // Store matched profile data for chat
      try {
        localStorage.setItem("matchedProfileName", currentProfile.name)
        localStorage.setItem("matchedProfilePhoto", currentProfile.image)
        localStorage.setItem("matchedProfileAge", currentProfile.age.toString())
        localStorage.setItem("matchedProfileBio", currentProfile.bio)
        localStorage.setItem("matchedProfileInterests", JSON.stringify(currentProfile.interests))
      } catch (error) {
        console.error("Error storing matched profile data:", error)
      }

      setTimeout(() => {
        setShowRewardPopup(false)
        setMatchedProfile(currentProfile)
        setShowMatchAnimation(true)

        setTimeout(() => {
          setShowMatchAnimation(false)
          onNavigate("chat", currentProfile.id.toString())
        }, 3000)
      }, 2000)
    }

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1)
      setIsAnimating(false)
      setIsVideoReady(false) // Reset video ready state for next profile
      setShowVideoPlayButton(false) // Hide play button for next profile
    }, 500)
  }, [
    isAnimating,
    currentIndex,
    profiles,
    userStats,
    isFirstTimeVisit,
    isBlocked,
    isAutomationActive,
    saveUserStats,
    onNavigate,
  ])

  // Handle skip action with new popup behavior and video stopping
  const handleSkip = useCallback(() => {
    if (isAnimating || currentIndex >= profiles.length) return

    // Don't allow manual skips when automation is active
    if (isAutomationActive) {
      console.log("🤖 Manual skip blocked - automation is active")
      return
    }

    // Stop video immediately if current profile has video
    const currentProfile = profiles[currentIndex]
    if (currentProfile?.hasVideo) {
      console.log("🛑 Stopping video due to skip action")
    }

    setIsAnimating(true)

    // Update reject count
    const newStats = {
      ...userStats,
      rejects: userStats.rejects + 1,
    }
    saveUserStats(newStats)

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1)
      setIsAnimating(false)
      setIsVideoReady(false) // Reset video ready state for next profile
      setShowVideoPlayButton(false) // Hide play button for next profile
    }, 300)
  }, [isAnimating, currentIndex, userStats, isFirstTimeVisit, isBlocked, isAutomationActive, saveUserStats])

  // Handle tutorial close
  const handleTutorialClose = useCallback(() => {
    setShowTutorial(false)
    localStorage.setItem("hasSeenTutorial", "true")
  }, [])

  // Handle reward popup
  const handleRewardContinue = useCallback(() => {
    setShowRewardPopup(false)
  }, [])

  const handlePurchase = useCallback(() => {
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
  }, [])

  const handleBackRedirect = useCallback(() => {
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
  }, [])

  // Handle popup closes - maintain blocking on subsequent visits
  const handleLimitPopupClose = useCallback(() => {
    setShowLimitPopup(false)
    // Keep isBlocked true so popup reappears on next interaction
  }, [])

  const handleVipPopupClose = useCallback(() => {
    setShowVipPopup(false)
    // Keep isBlocked true so popup reappears on next interaction
  }, [])

  const handleWithdrawalPopupClose = useCallback(() => {
    setShowWithdrawalPopup(false)
    // Keep isBlocked true so popup reappears on next interaction
  }, [])

  // Handle closing video tutorial
  const handleVideoTutorialClose = useCallback(() => {
    setShowVideoTutorial(false)
    setHasSeenVideoTutorial(true)
    localStorage.setItem("hasSeenVideoTutorial", "true")
  }, [])

  // Handle closing switch tutorial
  const handleSwitchTutorialClose = useCallback(() => {
    setShowSwitchTutorial(false)
    setHasSeenSwitchTutorial(true)
    localStorage.setItem("hasSeenSwitchTutorial", "true")
  }, [])

  // Get current profile
  const currentProfile = profiles[currentIndex]

  // CRITICAL: Check if current profile is the second one (index 1) for video
  const isSecondProfile = currentIndex === 1
  const shouldShowVideo = isSecondProfile && currentProfile?.hasVideo && currentProfile?.videoUrl

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E469B3] mb-4" />
        <p className="text-lg">Cargando perfiles...</p>
      </div>
    )
  }

  if (!currentProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
        <Heart className="h-16 w-16 text-[#E469B3] mb-4" />
        <h2 className="text-2xl font-bold mb-2">No hay más perfiles</h2>
        <p className="text-gray-400 text-center mb-6">
          Has visto todos los perfiles disponibles. ¡Vuelve más tarde para nuevos matches!
        </p>
        <Button
          onClick={() => {
            setCurrentIndex(0)
            setProfiles(generateProfileData())
          }}
          className="bg-[#E469B3] hover:bg-[#D55AA4]"
        >
          Empezar de Nuevo
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden" ref={containerRef}>
      {/* NEW: Conditional background overlay for Switch tutorial */}
      <AnimatePresence>
        {showSwitchTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 z-[60]" // Covers entire screen, but header is above it
          />
        )}
      </AnimatePresence>

      {/* Header - UPDATED: Added lightning icon and automation switch group positioned in front of balance */}
      <div className="relative z-[70] flex items-center justify-between p-4 pt-safe">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-[#E469B3]">
            <Image
              src={userPhoto || "/placeholder.svg"}
              alt="Tu perfil"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-white">{userName}</p>
              {/* PRO Badge - matching reference image design */}
              <div className="bg-[#E469B3] px-2 py-0.5 rounded-md flex items-center justify-center">
                <span className="text-white text-xs font-bold tracking-wide">PRO</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3 text-[#E469B3]" fill="#E469B3" />
                <span>{userStats.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <X className="h-3 w-3 text-gray-400" />
                <span>{userStats.rejects}</span>
              </div>
            </div>
          </div>
        </div>

        {/* UPDATED: Lightning icon + automation switch group positioned in front of balance counter */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Lightning icon + automation switch group - disabled until third profile */}
          <div
            className={`relative flex items-center gap-2 transition-opacity duration-300 ${currentIndex < 2 ? "opacity-50" : "opacity-100"}`}
          >
            <Zap className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: "#e066af" }} fill="#e066af" />
            <AutomationSwitch
              isActive={isAutomationActive}
              onToggle={handleAutomationToggle}
              disabled={isAnimating || showWelcomePopup || showTutorial || currentIndex < 2}
            />
            {/* NEW: Circular arc highlight for Switch button */}
            {showSwitchTutorial && (
              <div className="absolute -inset-2 rounded-full border-2 border-[#dc61ab] animate-ping-slow pointer-events-none z-[71]" />
            )}
          </div>

          {/* Balance counter */}
          <div className="text-green-400 font-bold bg-gradient-to-r from-green-600/20 to-green-500/10 px-3 py-1 rounded-full">
            {currencyLoaded ? formatCurrency(userStats.earnings) : `$${userStats.earnings.toFixed(2)}`}
          </div>
        </div>
      </div>

      {/* Main Card Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative w-full max-w-sm h-[600px]">
          <motion.div
            ref={cardRef}
            className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
            animate={isAnimating ? { scale: 0.95, opacity: 0.8 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Profile Image or Video - CORRECTED: Only show video for second profile */}
            <div className="relative h-full">
              {shouldShowVideo ? (
                <ProfileVideoPlayer
                  videoUrl={currentProfile.videoUrl!}
                  isVisible={!isAnimating && !showWelcomePopup && !showTutorial}
                  isRewardPopupVisible={showRewardPopup}
                  onVideoReady={() => setIsVideoReady(true)}
                  onVideoEnded={handleVideoEnded}
                  onVideoPausedAfterInitialPlay={handleVideoPausedAfterInitialPlay}
                  isTutorialActive={showVideoTutorial} // Pass tutorial state to video player
                />
              ) : (
                <Image
                  src={currentProfile.image || "/placeholder.svg"}
                  alt={currentProfile.name}
                  fill
                  className="object-cover"
                  priority
                />
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Online Status */}
              {currentProfile.isOnline && (
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-green-500/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-white font-medium">En línea</span>
                </div>
              )}

              {/* Profile Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold text-white">{currentProfile.name}</h2>
                  <span className="text-xl text-white/80">{currentProfile.age}</span>
                  <Crown className="h-5 w-5 text-yellow-500" />
                </div>

                <div className="flex items-center gap-1 mb-3">
                  <MapPin className="h-4 w-4 text-gray-300" />
                  <span className="text-sm text-gray-300">{currentProfile.distance}</span>
                </div>

                <p className="text-sm text-white/90 mb-3 line-clamp-2">{currentProfile.bio}</p>

                {/* Interests */}
                <div className="flex flex-wrap gap-2">
                  {currentProfile.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-8 p-6 pb-safe">
        <motion.button
          onClick={handleSkip}
          disabled={isAnimating || isAutomationActive}
          className="h-16 w-16 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center shadow-lg disabled:opacity-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="h-8 w-8 text-gray-300" />
        </motion.button>

        <motion.button
          onClick={handleLike}
          disabled={isAnimating || isAutomationActive}
          className="h-20 w-20 rounded-full bg-gradient-to-r from-[#E469B3] to-[#D55AA4] hover:from-[#D55AA4] hover:to-[#C44B95] flex items-center justify-center shadow-lg disabled:opacity-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart className="h-10 w-10 text-white" fill="white" />
        </motion.button>
      </div>

      {/* Welcome Popup - Shows first */}
      <WelcomePopup isOpen={showWelcomePopup} onClose={handleWelcomePopupClose} onTryPro={handleWelcomePopupTryPro} />

      {/* Tutorial Overlay - Shows ONLY after welcome popup is closed */}
      <RefinedTutorialOverlay
        isVisible={showTutorial && hasClosedWelcomePopup && !showWelcomePopup}
        onClose={handleTutorialClose}
      />

      {/* NEW: Video Tutorial Overlay */}
      <VideoTutorialOverlay
        isVisible={showVideoTutorial}
        onClose={handleVideoTutorialClose}
        onPlayButtonVisible={showVideoPlayButton}
      />

      {/* NEW: Switch Button Tutorial Overlay */}
      <SwitchTutorialOverlay isVisible={showSwitchTutorial} onClose={handleSwitchTutorialClose} />

      {/* NEW: Curved Arrow for Switch Tutorial - CORRECTED: Smaller size, proper positioning */}
      <AnimatePresence>
        {showSwitchTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 w-full h-full pointer-events-none z-[65]" // Behind tutorial card content
          >
            <svg
              className="w-full h-full"
              viewBox="0 0 375 812" // iPhone viewport for precise positioning
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <marker
                  id="switchArrowhead"
                  markerWidth="8"
                  markerHeight="8"
                  refX="4"
                  refY="4"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L8,4 L0,8 Z" fill="#e066af" />
                </marker>
              </defs>
              {/* Rotated 30 degrees counterclockwise for better alignment with switch button */}
              <path
                d="M 187.5 330 C 187.5 280, 160 240, 200 200 C 240 160, 270 120, 300 90"
                fill="none"
                stroke="#e066af"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                markerEnd="url(#switchArrowhead)"
                transform="rotate(-85 280 110)" // Rotate 30 degrees counterclockwise around the arrow endpoint
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Match Animation */}
      <AnimatePresence>
        {showMatchAnimation && matchedProfile && (
          <MatchAnimationOverlay userImage={userPhoto} matchedProfile={matchedProfile} />
        )}
      </AnimatePresence>

      {/* Reward Popup */}
      <AnimatePresence>
        {showRewardPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <RewardPopup
              amount={rewardAmount}
              onClose={() => setShowRewardPopup(false)}
              onContinue={handleRewardContinue}
              formatCurrency={formatCurrency}
              currencyLoaded={currencyLoaded}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }

        @keyframes tutorial-pulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 0; }
          100% { transform: scale(1); opacity: 0.8; }
        }

        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          70% { transform: scale(1.2); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
