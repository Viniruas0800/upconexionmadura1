"use client"

import type React from "react"
import { useEffect, useState, useRef, useCallback, memo } from "react"
import Image from "next/image"
import { MessageSquare, Send, Calendar, Mic, Pause, Gift, X, Phone, PhoneOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AnimatePresence, motion } from "framer-motion"
import { useCurrency } from "@/hooks/use-currency"
import VoiceCallPopup from "@/components/voice-call-popup"
import CallTutorialOverlay from "@/components/call-tutorial-overlay"
import VideoButtonMessage from "@/components/video-button-message"
import FullscreenVideoPlayer from "@/components/fullscreen-video-player"
import { cn } from "@/lib/utils"
import ProVersionPopup from "@/components/pro-version-popup"

interface ChatScreenProps {
  onNavigate: (
    screen: "home" | "login" | "registration" | "profile-setup" | "welcome" | "discover" | "chat" | "quiz" | "upsell1",
    chatId?: string,
  ) => void
  chatId?: string
}

interface MatchedProfile {
  id: number
  name: string
  photo: string
  age?: number
  bio?: string
  tags?: string[]
}

interface Message {
  id: number
  sender: "me" | "them"
  text?: string
  isVoice?: boolean
  audioUrl?: string
  duration?: number
  time: string
  audioId?: number
  isGiftIcon?: boolean
  isMissedCall?: boolean
  isVideo?: boolean
  videoUrl?: string
  hasBeenPlayed?: boolean
}

// Updated Audio URLs with single audio
const AUDIO_URLS = {
  SINGLE: "https://files.catbox.moe/u9g2v7.m4a",
}

const AUDIO_DURATIONS = {
  SINGLE: 30,
}

// Gift amount options - randomly selected
const GIFT_AMOUNTS = ["75.00", "85.00", "95.00", "110.00"]

// Custom Audio Player Component
const CustomAudioPlayer = memo(function CustomAudioPlayer({
  audioUrl,
  profileImage,
  onPlay,
  onPause,
  onEnded,
  onComplete,
  onProgress,
  className = "",
  isCompleted = false,
  showProfileImage = true,
  audioId = 1,
}: {
  audioUrl: string
  profileImage?: string
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onComplete?: () => void
  onProgress?: (currentTime: number) => void
  className?: string
  isCompleted?: boolean
  showProfileImage?: boolean
  audioId?: number
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(isCompleted)
  const [waveformData, setWaveformData] = useState<number[]>([])

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const progressRef = useRef<HTMLDivElement | null>(null)

  // Generate waveform data
  useEffect(() => {
    setWaveformData(() => {
      const data = []
      const seed = audioId * 1000
      for (let i = 0; i < 60; i++) {
        let height =
          Math.sin((i + seed) * 0.2) * 0.5 +
          0.5 +
          Math.sin((i + seed) * 0.5) * 0.3 +
          Math.sin((i + audioId * 10) * 0.3) * 0.2
        height = Math.max(0.15, Math.min(0.85, height))
        data.push(height)
      }
      return data
    })
  }, [audioId])

  // Audio setup and lifecycle management
  useEffect(() => {
    // Use a single audio instance throughout the component's life
    if (!audioRef.current) {
      audioRef.current = new Audio()
    }
    const audio = audioRef.current

    // 1. Proper Audio Element Initialization
    audio.crossOrigin = "anonymous"
    audio.preload = "auto"
    audio.volume = 1.0
    audio.muted = false

    const handleTimeUpdate = () => {
      if (!audio) return
      const current = audio.currentTime
      const total = audio.duration || 0
      setCurrentTime(current)
      setProgress(total > 0 ? current / total : 0)
      if (onProgress) onProgress(current)
      if (total > 0 && current / total > 0.9 && !isComplete) {
        setIsComplete(true)
        if (onComplete) onComplete()
      }
      drawWaveform(current / total)
    }

    // 6. Detailed Logging for Debugging
    const handleLoadStart = () => {
      console.log(`[Audio #${audioId}] Load Start:`, audioUrl)
      setIsLoading(true)
    }
    const handleLoadedMetadata = () => {
      console.log(`[Audio #${audioId}] Metadata Loaded. Duration: ${audio.duration}`)
      setDuration(audio.duration)
      setIsLoading(false)
      drawWaveform(0)
    }
    const handleCanPlayThrough = () => {
      console.log(`[Audio #${audioId}] Can Play Through.`)
      setIsLoading(false)
    }
    const handleError = (e: Event) => {
      console.error(`[Audio #${audioId}] Error:`, e)
      setError("Failed to load audio.")
      setIsLoading(false)
    }
    const handlePlaying = () => {
      console.log(`[Audio #${audioId}] State: Playing`)
      setIsPlaying(true)
    }
    const handlePause = () => {
      console.log(`[Audio #${audioId}] State: Paused`)
      setIsPlaying(false)
    }
    const handleEnded = () => {
      console.log(`[Audio #${audioId}] State: Ended`)
      setIsPlaying(false)
      setProgress(1)
      setCurrentTime(audio.duration)
      if (onEnded) onEnded()
    }

    audio.addEventListener("loadstart", handleLoadStart)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("canplaythrough", handleCanPlayThrough)
    audio.addEventListener("error", handleError)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("playing", handlePlaying)
    audio.addEventListener("pause", handlePause)
    audio.addEventListener("ended", handleEnded)

    // Set source only if it's different to avoid re-loading
    if (audio.src !== audioUrl) {
      console.log(`[Audio #${audioId}] Setting new src:`, audioUrl)
      audio.src = audioUrl
      audio.load()
    }

    // Cleanup function
    return () => {
      console.log(`[Audio #${audioId}] Cleaning up listeners.`)
      audio.removeEventListener("loadstart", handleLoadStart)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("canplaythrough", handleCanPlayThrough)
      audio.removeEventListener("error", handleError)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("playing", handlePlaying)
      audio.removeEventListener("pause", handlePause)
      audio.removeEventListener("ended", handleEnded)
      // Don't pause or reset src here if we want it to persist across re-renders
    }
  }, [audioUrl, audioId, onProgress, onComplete, onEnded])

  // 2 & 5. Playback Triggering and State Management
  const togglePlayPause = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return

    // 5. Proper Playback State Management
    if (audio.paused || audio.ended) {
      // 2. Handle playback promises
      try {
        await audio.play()
        console.log(`[Audio #${audioId}] Playback started successfully.`)
        if (onPlay) onPlay()
      } catch (err) {
        console.error(`[Audio #${audioId}] Playback prevented:`, err)
        setError("Playback was blocked.")
      }
    } else {
      audio.pause()
      if (onPause) onPause()
    }
  }, [audioId, onPlay, onPause])

  const drawWaveform = (progressRatio: number) => {
    if (!canvasRef.current || !waveformData.length) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const barCount = Math.floor(canvas.width / 4)
    const centerY = canvas.height / 2
    const playedBars = Math.floor(progressRatio * barCount)

    for (let i = 0; i < barCount; i++) {
      const x = i * 4
      const height =
        (0.2 + 0.6 * (0.5 + 0.3 * Math.sin(i * 0.1) + 0.2 * Math.sin(i * 0.2 + 1) + 0.1 * Math.sin(i * 0.05 + 2))) *
        canvas.height *
        0.7

      ctx.fillStyle = i <= playedBars ? "#FFFFFF" : "#AAAAAA"
      ctx.fillRect(x, centerY - height / 2, 2, height)
    }
  }

  const completedIndicator = isComplete && (
    <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-green-500 border border-gray-800 flex items-center justify-center">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )

  // Canvas resize effect
  useEffect(() => {
    if (canvasRef.current && waveformData.length > 0) {
      const handleResize = () => {
        if (canvasRef.current && containerRef.current) {
          const width = containerRef.current.clientWidth
          canvasRef.current.width = width
          drawWaveform(progress)
        }
      }

      handleResize()
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [waveformData, progress])

  return (
    <div className={`flex items-center ${className}`}>
      {showProfileImage && (
        <div className="relative h-10 w-10 overflow-hidden rounded-full mr-3 flex-shrink-0">
          <Image
            src={profileImage || "/placeholder.svg"}
            alt="Profile"
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
          {completedIndicator}
        </div>
      )}

      <div className="relative flex-shrink-0">
        <button
          onClick={togglePlayPause}
          disabled={!!error || isLoading}
          className="flex-shrink-0 h-12 w-12 rounded-full bg-[#E469B3] hover:bg-[#D55AA4] flex items-center justify-center mr-3"
          style={{ backgroundColor: "#d14d9a" }}
        >
          {isLoading ? (
            <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-5 w-5 text-white" />
          ) : (
            <svg className="h-5 w-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        {!showProfileImage && completedIndicator}
      </div>

      <div className="flex-1 bg-[#1e1e24] rounded-lg overflow-hidden h-12" ref={containerRef}>
        <div
          ref={progressRef}
          onClick={(e) => {
            if (!audioRef.current || !progressRef.current) return
            const rect = progressRef.current.getBoundingClientRect()
            const clickX = (e.clientX - rect.left) / rect.width
            const newTime = clickX * (audioRef.current.duration || 0)
            audioRef.current.currentTime = newTime
            setCurrentTime(newTime)
            setProgress(clickX)
          }}
          className="relative h-full w-full cursor-pointer bg-transparent rounded-lg overflow-hidden"
        >
          <canvas ref={canvasRef} className="w-full h-full" width={500} height={40} />
        </div>
      </div>

      {error && <div className="text-red-500 text-xs ml-2">{error}</div>}
    </div>
  )
})

// Message Component
const ChatMessage = memo(function ChatMessage({
  id,
  sender,
  text,
  isVoice,
  audioUrl,
  duration,
  time,
  profileImage,
  onAudioComplete,
  onAudioProgress,
  isAudioCompleted = false,
  audioId,
  isMissedCall = false,
  isVideo = false,
  videoUrl,
  hasBeenPlayed = false,
  onVideoClick,
}: {
  id: number
  sender: "me" | "them"
  text?: string
  isVoice?: boolean
  audioUrl?: string
  duration?: number
  time: string
  profileImage?: string
  onAudioComplete?: () => void
  onAudioProgress?: (currentTime: number) => void
  isAudioCompleted?: boolean
  audioId?: number
  isMissedCall?: boolean
  isVideo?: boolean
  videoUrl?: string
  hasBeenPlayed?: boolean
  onVideoClick?: () => void
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  // Video message
  if (isVideo) {
    return (
      <div className="flex justify-start items-end">
        <div className="mr-2 h-10 w-10 overflow-hidden rounded-full flex-shrink-0">
          <Image
            src={profileImage || "/placeholder.svg"}
            alt="Profile"
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="max-w-[75%]">
          <VideoButtonMessage timestamp={time} onClick={onVideoClick || (() => {})} hasBeenPlayed={hasBeenPlayed} />
        </div>
      </div>
    )
  }

  // Missed call message
  if (isMissedCall) {
    return (
      <div className="flex justify-start items-end">
        <div className="mr-2 h-10 w-10 overflow-hidden rounded-full flex-shrink-0">
          <Image
            src={profileImage || "/placeholder.svg"}
            alt="Profile"
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="max-w-[75%] rounded-2xl px-4 py-3 bg-gray-800 text-white rounded-bl-none">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <PhoneOff className="h-5 w-5 text-red-400" />
            </div>
            <div className="flex-1">
              <p className="text-base">{text}</p>
            </div>
          </div>
          <div className="mt-1 text-right text-xs text-white/70">{time}</div>
        </div>
      </div>
    )
  }

  if (isVoice) {
    return (
      <div className={`flex ${sender === "me" ? "justify-end" : "justify-start"} items-end`}>
        {sender === "them" && (
          <div className="mr-2 h-10 w-10 overflow-hidden rounded-full flex-shrink-0">
            <Image
              src={profileImage || "/placeholder.svg"}
              alt="Profile"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div
          className={`max-w-[75%] rounded-2xl px-4 py-3 ${
            sender === "me" ? "bg-pink-600 text-white rounded-br-none" : "bg-gray-800 text-white rounded-bl-none"
          }`}
        >
          {audioUrl ? (
            <CustomAudioPlayer
              audioUrl={audioUrl}
              profileImage={profileImage}
              onPlay={() => {
                setIsPlayingAudio(true)
              }}
              onPause={() => setIsPlayingAudio(false)}
              onEnded={() => setIsPlayingAudio(false)}
              onComplete={onAudioComplete}
              onProgress={onAudioProgress}
              isCompleted={isAudioCompleted}
              showProfileImage={false}
              audioId={audioId || id}
            />
          ) : (
            <div className="text-sm text-gray-300">Audio no disponible</div>
          )}

          <div className="mt-1 text-right text-xs text-white/70">
            {time}
            {sender === "me" && <span className="ml-1">✓✓</span>}
          </div>
        </div>

        {sender === "me" && (
          <div className="ml-2 h-10 w-10 overflow-hidden rounded-full flex-shrink-0">
            <Image
              src={profileImage || "/placeholder.svg"}
              alt="You"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`flex ${sender === "me" ? "justify-end" : "justify-start"} items-end`}>
      {sender === "them" && (
        <div className="mr-2 h-10 w-10 overflow-hidden rounded-full flex-shrink-0">
          <Image
            src={profileImage || "/placeholder.svg"}
            alt="Profile"
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          sender === "me" ? "bg-pink-600 text-white rounded-br-none" : "bg-gray-800 text-white rounded-bl-none"
        }`}
      >
        <p className="text-base">{text}</p>
        <div className="mt-1 text-right text-xs text-white/70">
          {time}
          {sender === "me" && <span className="ml-1">✓✓</span>}
        </div>
      </div>

      {sender === "me" && (
        <div className="ml-2 h-10 w-10 overflow-hidden rounded-full flex-shrink-0">
          <Image
            src={profileImage || "/placeholder.svg"}
            alt="You"
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </div>
      )}
    </div>
  )
})

// Gift Notification Component
function GiftNotification({ name, onClick, onClose }: { name: string; onClick: () => void; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="relative w-full rounded-xl bg-gradient-to-r from-pink-500/10 to-pink-600/5 p-4 border border-pink-500/30 shadow-lg mb-4"
    >
      <button
        onClick={onClose}
        className="absolute right-2 top-2 rounded-full bg-gray-800/50 p-1 text-gray-400 hover:bg-gray-700 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-center">
        <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink-500/20">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          >
            <Gift className="h-6 w-6 text-pink-500" />
          </motion.div>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{name} ¡Te envié un regalo!</h3>
          <p className="text-sm text-gray-300">Haz clic para ver lo que te envió.</p>
        </div>
      </div>

      <Button
        onClick={onClick}
        className="mt-3 w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700"
      >
        <Gift className="mr-2 h-4 w-4" />
        Ver Regalo
      </Button>
    </motion.div>
  )
}

// Enhanced Confetti Animation Component (matching /bemvindo screen exactly)
function GiftConfettiAnimation() {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${6 + Math.random() * 8}px`,
            height: `${6 + Math.random() * 8}px`,
            backgroundColor: ["#E469B3", "#D55AA4", "#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"][
              i % 8
            ],
            borderRadius: i % 2 === 0 ? "50%" : "0%",
          }}
          initial={{
            y: -10,
            rotate: Math.random() * 360,
            opacity: 1,
          }}
          animate={{
            y: window.innerHeight + 50,
            rotate: Math.random() * 720 + 360,
            opacity: 0,
          }}
          transition={{
            duration: 2.5,
            delay: (Math.random() * 1000) / 1000,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}

// Gift Popup Component - Updated with random gift amount
function GiftPopup({
  onClick,
  name,
  amount,
  photo,
  formatCurrency,
  currencyLoaded = false,
}: {
  onClick: () => void
  name: string
  amount: string
  photo?: string
  formatCurrency?: (amount: number | string) => string
  currencyLoaded?: boolean
}) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Trigger confetti immediately when popup appears
    setShowConfetti(true)
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      className="w-full max-w-sm mx-auto relative"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 rounded-2xl blur-sm opacity-70" />

      <div className="relative bg-[#111827] rounded-2xl overflow-hidden border-2 border-yellow-500/50">
        {/* Enhanced Confetti Animation - identical to /bemvindo */}
        {showConfetti && <GiftConfettiAnimation />}

        {/* Removed close button section entirely */}

        <div className="pt-8 pb-4 flex flex-col items-center relative z-10">
          <h2 className="text-center text-2xl font-bold text-white">Regalo especial</h2>
        </div>

        {/* Rest of the component remains the same */}
        <div className="flex flex-col items-center px-6 mb-4">
          <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-yellow-500 mb-3 shadow-lg shadow-yellow-500/20">
            <Image
              src={photo || "/profile-new1.jpeg"}
              alt={name}
              fill
              className="object-cover"
              onError={(e) => {
                console.error("Profile image failed to load")
                e.currentTarget.src = "/placeholder.svg"
              }}
            />
          </div>

          <motion.h2
            className="text-xl font-bold text-white text-center"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">{name}</span>{" "}
            Te envié un regalo
          </motion.h2>
        </div>

        <div className="px-6 mb-6">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-800/80 to-gray-900/80 p-4 border border-yellow-500/20">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
            />

            <div className="flex items-center justify-center">
              <motion.div
                className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                {currencyLoaded && formatCurrency ? formatCurrency(amount) : `$${amount}`}
              </motion.div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <motion.button
            onClick={onClick}
            className="w-full relative overflow-hidden rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 py-4 text-lg font-bold text-gray-900 hover:from-yellow-400 hover:to-yellow-300 shadow-lg shadow-yellow-500/30"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 0.5 }}
            />

            <span className="relative z-10 flex items-center justify-center">
              <Gift className="mr-2 h-5 w-5" />
              Reclamar regalo
            </span>
          </motion.button>
        </div>

        <p className="pb-4 text-center text-xs text-gray-400">
          Reclama tu regalo ahora y disfruta beneficios exclusivos
        </p>
      </div>
    </motion.div>
  )
}

// Balance Received Popup Component
function BalanceReceivedPopup({
  onClick,
  onClose,
  finalBalance,
  giftAmount,
  formatCurrency,
  currencyLoaded = false,
}: {
  onClick: () => void
  onClose: () => void
  finalBalance: string
  giftAmount: string
  formatCurrency?: (amount: number | string) => string
  currencyLoaded?: boolean
}) {
  return (
    <motion.div
      className="w-full max-w-sm mx-auto relative"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-teal-400 to-green-500 rounded-2xl blur-xl opacity-10" />

      <div className="relative bg-gradient-to-b from-[#1a2333]/90 to-[#111827]/90 backdrop-blur-md rounded-2xl overflow-hidden border-2 border-green-500/30 p-6">
        <div className="pt-2 pb-4 flex flex-col items-center relative z-10">
          <motion.div
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-teal-600 shadow-lg shadow-green-500/20"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h2 className="text-center text-2xl font-bold text-white">Saldo Recibido</h2>
        </div>

        <div className="px-2 mb-6 text-center">
          <p className="text-gray-300 leading-relaxed">Una cantidad de</p>
          <motion.div
            className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-300 my-2"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            {currencyLoaded && formatCurrency ? formatCurrency(giftAmount) : `$${giftAmount}`}
          </motion.div>
          <p className="text-gray-300 leading-relaxed">ha sido agregada a tu Billetera.</p>
        </div>

        <div className="bg-black/20 rounded-lg p-4 mb-6 border border-gray-700">
          <p className="text-center text-sm text-gray-400">Tu nuevo saldo total es:</p>
          <p className="text-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-300 mt-1">
            {finalBalance}
          </p>
        </div>

        <div className="px-2 pb-2">
          <motion.button
            onClick={onClose}
            className="w-full relative overflow-hidden rounded-full bg-gradient-to-r from-green-500 to-teal-500 py-4 text-lg font-bold text-white hover:from-green-400 hover:to-teal-400 shadow-lg shadow-green-500/30"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center justify-center">
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h5M7 9l-3 3m0 0l3 3m-3-3h16"
                />
              </svg>
              Cerrar
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// Animated Loading Overlay
function MoneyAnimation({
  isVisible,
  onComplete,
  startPosition,
  endPosition,
}: {
  isVisible: boolean
  onComplete: () => void
  startPosition: { x: number; y: number }
  endPosition: { x: number; y: number }
}) {
  const numberOfCoins = 15
  const coinSize = 30
  const animationDuration = 1.5 // seconds

  const coinStyle = {
    width: `${coinSize}px`,
    height: `${coinSize}px`,
    borderRadius: "50%",
    backgroundColor: "gold",
    position: "absolute",
    backgroundImage: 'url("/coin.png")',
    backgroundSize: "cover",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
  }

  const getCoinAnimationProps = (index: number) => {
    const delay = (index / numberOfCoins) * (animationDuration / 3) // Staggered start
    const angle = (index / numberOfCoins) * Math.PI * 2 // Distribute coins in a circle

    // Calculate a circular offset from the start position
    const offsetX = Math.cos(angle) * 50 // Adjust for spread
    const offsetY = Math.sin(angle) * 50 // Adjust for spread

    const adjustedStartPosition = {
      x: startPosition.x + offsetX,
      y: startPosition.y + offsetY,
    }

    return {
      key: `coin-${index}`,
      style: {
        ...coinStyle,
        left: `${adjustedStartPosition.x - coinSize / 2}px`,
        top: `${adjustedStartPosition.y - coinSize / 2}px`,
      },
      initial: {
        x: 0,
        y: 0,
        opacity: 1,
        scale: 1,
      },
      animate: {
        x: endPosition.x - adjustedStartPosition.x,
        y: endPosition.y - adjustedStartPosition.y,
        opacity: 0,
        scale: 0.5,
      },
      transition: {
        duration: animationDuration,
        delay: delay,
        ease: "easeOut",
      },
      onComplete: () => {
        if (index === numberOfCoins - 1) {
          onComplete()
        }
      },
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {Array.from({ length: numberOfCoins }).map((_, index) => (
            <motion.div {...getCoinAnimationProps(index)} key={index} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const ChatScreen: React.FC<ChatScreenProps> = ({ onNavigate, chatId }) => {
  const profileId = Number.parseInt(chatId || "1")

  // Get the profile, ensuring it's updated with matched data
  const getProfile = (): MatchedProfile => {
    const foundProfile = PROFILES_DATA.find((p) => p.id === profileId)
    if (foundProfile) {
      return foundProfile
    }
    // Fallback to first profile if not found
    return PROFILES_DATA[0]
  }

  const profile = getProfile()

  // State management
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [showGiftNotification, setShowGiftNotification] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null)
  const [showRecordingStatus, setShowRecordingStatus] = useState(false)
  const [messageCount, setMessageCount] = useState(0)
  const [showGiftPopup, setShowGiftPopup] = useState(false)
  // Simplified audio flow control - single audio only
  const [hasUserSentMessage, setHasUserSentMessage] = useState(false)
  const [isInitialTextSent, setIsInitialTextSent] = useState(false)
  const [hasUserRepliedToInitialText, setHasUserRepliedToInitialText] = useState(false)
  const [isSingleAudioSent, setIsSingleAudioSent] = useState(false)
  const [singleAudioPlayTime, setSingleAudioPlayTime] = useState(0)
  // Persistent flag to prevent duplicate follow-up messages
  const hasSentFollowUp = useRef(false)
  // Video message states
  const hasSentVideoMessage = useRef(false)
  const [videoMessagePlayed, setVideoMessagePlayed] = useState(false)
  const [showFullscreenVideo, setShowFullscreenVideo] = useState(false)
  const [isAudioError, setAudioError] = useState(false)
  const [waitingForResponse, setWaitingForResponse] = useState(false)
  const [showCrownIcon, setShowCrownIcon] = useState(false)
  const [isGiftRedeemed, setIsGiftRedeemed] = useState(false)
  const [audioCompletions, setAudioCompletions] = useState<{ [key: number]: boolean }>({})
  const [showMoneyAnimation, setShowMoneyAnimation] = useState(false)
  const [animationPositions, setAnimationPositions] = useState({ start: { x: 0, y: 0 }, end: { x: 0, y: 0 } })
  const [showBalanceReceivedPopup, setShowBalanceReceivedPopup] = useState(false)
  const { formatCurrency, formatCurrencyWithContext, isLoaded: currencyLoaded } = useCurrency()
  const [isCallPopupOpen, setIsCallPopupOpen] = useState(false)
  const [showCallTutorial, setShowCallTutorial] = useState(false)
  const [isCallButtonPermanentlyDisabled, setIsCallButtonPermanentlyDisabled] = useState(false)
  const [userPhoto, setUserPhoto] = useState<string | null>(null)
  const [balance, setBalance] = useState("$0.00")
  // State for Pro Version popup
  const [showProVersionPopup, setShowProVersionPopup] = useState(false)
  const [hasVideoQuestionBeenSent, setHasVideoQuestionBeenSent] = useState(false)
  const [proPopupShownThisSession, setProPopupShownThisSession] = useState(false)

  // NEW: Random gift amount state
  const [randomGiftAmount, setRandomGiftAmount] = useState("75.00")

  // Generate random gift amount on component mount
  useEffect(() => {
    const randomAmount = GIFT_AMOUNTS[Math.floor(Math.random() * GIFT_AMOUNTS.length)]
    setRandomGiftAmount(randomAmount)
  }, [])

  // Load matched profile data
  useEffect(() => {
    try {
      // Always try to load matched profile data first
      const storedName = localStorage.getItem("matchedProfileName")
      const storedPhoto = localStorage.getItem("matchedProfilePhoto")
      const storedAge = localStorage.getItem("matchedProfileAge")
      const storedBio = localStorage.getItem("matchedProfileBio")
      const storedInterests = localStorage.getItem("matchedProfileInterests")

      if (storedName && storedPhoto) {
        // Update the profile with matched data
        const updatedProfile: MatchedProfile = {
          id: profileId,
          name: storedName,
          photo: storedPhoto,
          age: storedAge ? Number.parseInt(storedAge) : 28,
          bio: storedBio || "I love traveling, seeing new places and interesting people. Let's talk?",
          tags: storedInterests ? JSON.parse(storedInterests) : ["Travel", "Music", "Gastronomy"],
        }

        // Find and update the profile in PROFILES_DATA
        const profileIndex = PROFILES_DATA.findIndex((p) => p.id === profileId)
        if (profileIndex !== -1) {
          PROFILES_DATA[profileIndex] = updatedProfile
        } else {
          // If profile doesn't exist, add it
          PROFILES_DATA.push(updatedProfile)
        }

        console.log(`✅ Loaded matched profile: ${storedName} with photo: ${storedPhoto}`)
      } else {
        console.log("⚠️ No matched profile data found in localStorage")
      }
    } catch (error) {
      console.error("Error loading matched profile data:", error)
    }
  }, [profileId])

  // Preload audio file
  useEffect(() => {
    try {
      const preloadAudio = (url: string, name: string) => {
        console.log(`Preloading ${name} audio:`, url)
        const audio = new Audio()
        audio.crossOrigin = "anonymous"
        audio.preload = "auto"
        audio.muted = false
        audio.volume = 1.0
        audio.src = url

        audio.addEventListener("canplaythrough", () => {
          console.log(`${name} audio preloaded successfully`)
        })

        audio.addEventListener("error", (e) => {
          console.error(`Error preloading ${name} audio ${url}:`, e)
        })

        audio.load()
      }

      preloadAudio(AUDIO_URLS.SINGLE, "SINGLE")
    } catch (error) {
      console.error("Error preloading audio:", error)
    }
  }, [])

  // Initialize chat with initial text message
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)

      // Get user's first name from profile data
      let userFirstName = "there" // fallback
      try {
        const savedProfile = localStorage.getItem("userProfile")
        if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile)
          if (parsedProfile.name) {
            // Extract first name (everything before the first space)
            userFirstName = parsedProfile.name.split(" ")[0]
          }
        }
      } catch (error) {
        console.error("Error getting user's first name:", error)
      }

      // Send initial text message
      const initialTextMessage: Message = {
        id: 1,
        sender: "them",
        text: `Holaa guapo, vi tu perfil y me gustaste mucho 😈`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages([initialTextMessage])
      setIsInitialTextSent(true)

      // Send second text message after 2 seconds
      setTimeout(() => {
        const secondTextMessage: Message = {
          id: 2,
          sender: "them",
          text: `¿Tudo bien contigo, lindo?`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
        setMessages((prev) => [...prev, secondTextMessage])
      }, 2000)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  // Add this useEffect after the existing useEffect hooks, around line 650

  const sendSingleAudio = useCallback(() => {
    if (isSingleAudioSent) return // Already sent, prevent duplicates

    setShowRecordingStatus(true)
    setTimeout(() => {
      setShowRecordingStatus(false)
      const singleAudio: Message = {
        id: Date.now() + 2, // Use timestamp to ensure unique IDs
        sender: "them",
        isVoice: true,
        audioUrl: AUDIO_URLS.SINGLE,
        duration: AUDIO_DURATIONS.SINGLE,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        audioId: 1,
      }
      setMessages((prev) => [...prev, singleAudio])
      setIsSingleAudioSent(true)
    }, 2000)
  }, [isSingleAudioSent])

  // Function to send video message
  const sendVideoMessage = useCallback(() => {
    if (hasSentVideoMessage.current) return // Already sent, prevent duplicates

    hasSentVideoMessage.current = true
    const videoMessage: Message = {
      id: Date.now() + 4,
      sender: "them",
      isVideo: true,
      videoUrl: "/video-011.mp4",
      hasBeenPlayed: videoMessagePlayed,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => [...prev, videoMessage])
  }, [videoMessagePlayed])

  // Load user data from localStorage
  useEffect(() => {
    try {
      // Load user profile data
      const savedProfile = localStorage.getItem("userProfile")
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile)
        if (parsedProfile.photos && parsedProfile.photos.length > 0) {
          setUserPhoto(parsedProfile.photos[0])
          console.log(`✅ Loaded user photo: ${parsedProfile.photos[0]}`)
        }
      }

      // Load monetary balance from userStats (from discover screen)
      const savedStats = localStorage.getItem("userStats")
      if (savedStats) {
        const parsedStats = JSON.parse(savedStats)
        if (parsedStats.earnings) {
          const formattedBalance = `$${parsedStats.earnings.toFixed(2)}`
          setBalance(formattedBalance)
          console.log(`✅ Loaded balance from userStats: ${formattedBalance}`)
        }
      } else {
        // Fallback to direct balance storage
        const storedBalance = localStorage.getItem("balance")
        if (storedBalance) {
          setBalance(storedBalance)
          console.log(`✅ Loaded balance from direct storage: ${storedBalance}`)
        }
      }

      // Check if gift was already redeemed
      const giftRedeemed = localStorage.getItem("giftRedeemed") === "true"
      setIsGiftRedeemed(giftRedeemed)
    } catch (error) {
      console.error("Error loading user data from localStorage:", error)
    }
  }, [])

  // Scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Handle audio completion and playback tracking
  const handleAudioComplete = useCallback((audioId: number) => {
    setAudioCompletions((prev) => ({ ...prev, [audioId]: true }))
  }, [])

  // Handle audio playback progress for triggering follow-up message
  const handleAudioProgress = useCallback(
    (audioId: number, currentTime: number) => {
      if (audioId === 1) {
        setSingleAudioPlayTime(currentTime)
        // Trigger follow-up message when user plays at least 5 seconds of audio
        if (currentTime >= 5 && !hasSentFollowUp.current) {
          hasSentFollowUp.current = true
          setTimeout(() => {
            const followUpMessage: Message = {
              id: Date.now() + 3,
              sender: "them",
              text: "Pero ya te mando una sorpresita...😈",
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }
            setMessages((prev) => [...prev, followUpMessage])

            // Send video message 2 seconds after the follow-up text
            setTimeout(() => {
              sendVideoMessage()
            }, 2000)
          }, 2000)
        }
      }
    },
    [sendVideoMessage],
  )

  const handleFirstUserInteraction = () => {
    if (isInitialTextSent && !hasUserRepliedToInitialText) {
      setHasUserRepliedToInitialText(true)
      const tutorialShown = localStorage.getItem("callTutorialShown_v2")
      if (!tutorialShown) {
        setShowCallTutorial(true)
        localStorage.setItem("callTutorialShown_v2", "true")
        // Audio flow is now triggered by handleCloseCallTutorial
      } else {
        if (!isSingleAudioSent) {
          setTimeout(() => {
            sendSingleAudio()
            setWaitingForResponse(false)
          }, 3000)
        }
      }
    } else {
      // Logic for subsequent messages - trigger follow-up if not already sent
      if (!hasSentFollowUp.current) {
        hasSentFollowUp.current = true
        setTimeout(() => {
          const followUpMessage: Message = {
            id: Date.now() + 3,
            sender: "them",
            text: "Pero ya te mando una sorpresita...😈",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }
          setMessages((prev) => [...prev, followUpMessage])

          // Send video message 2 seconds after the follow-up text
          setTimeout(() => {
            sendVideoMessage()
          }, 2000)
        }, 2000)
      }

      setTimeout(() => {
        setWaitingForResponse(false)
      }, 2000)
    }
  }

  const sendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: Date.now() + Math.random(), // Ensure unique ID
        sender: "me",
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages([...messages, newMsg])
      setNewMessage("")
      setWaitingForResponse(true)
      handleFirstUserInteraction()
    }
  }

  const toggleRecording = () => {
    if (isRecording) {
      if (recordingInterval) {
        clearInterval(recordingInterval)
        setRecordingInterval(null)
      }

      const newMsg: Message = {
        id: messages.length + 1,
        sender: "me",
        isVoice: true,
        duration: recordingTime,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages([...messages, newMsg])
      setRecordingTime(0)
      setWaitingForResponse(true)
      handleFirstUserInteraction()
    } else {
      setRecordingInterval(
        setInterval(() => {
          setRecordingTime((prev) => prev + 1)
        }, 1000),
      )
    }
    setIsRecording(!isRecording)
  }

  const handleVideoClick = () => {
    if (!videoMessagePlayed) {
      setShowFullscreenVideo(true)
    }
  }

  const handleVideoEnd = () => {
    setVideoMessagePlayed(true)
    // Update the message in the messages array to reflect that it has been played
    setMessages((prev) => prev.map((msg) => (msg.isVideo ? { ...msg, hasBeenPlayed: true } : msg)))

    // Send follow-up text message immediately after video ends
    setTimeout(() => {
      const followUpTextMessage: Message = {
        id: Date.now() + 5,
        sender: "them",
        text: "¿Te gustó el vídeo?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, followUpTextMessage])
      setHasVideoQuestionBeenSent(true) // Track that this specific message was sent
    }, 500)
  }

  const handleGiftClick = () => {
    setShowGiftPopup(true)
  }

  const handleGiftClaim = () => {
    // Calculate animation positions
    const startPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const endPos = { x: window.innerWidth - 100, y: 50 }

    setAnimationPositions({ start: startPos, end: endPos })
    setShowMoneyAnimation(true)
    setShowGiftPopup(false)

    // Update balance after animation
    setTimeout(() => {
      try {
        // Parse current balance properly
        const currentBalanceStr = balance.replace("$", "").replace(",", ".").trim()
        const currentBalance = Number.parseFloat(currentBalanceStr) || 0
        const giftAmountNum = Number.parseFloat(randomGiftAmount)
        const newBalanceAmount = currentBalance + giftAmountNum
        const newBalance = `$${newBalanceAmount.toFixed(2)}`

        // Update both balance state and localStorage
        setBalance(newBalance)
        localStorage.setItem("balance", newBalance)

        // Also update userStats for consistency
        const savedStats = localStorage.getItem("userStats")
        if (savedStats) {
          const parsedStats = JSON.parse(savedStats)
          parsedStats.earnings = newBalanceAmount
          localStorage.setItem("userStats", JSON.stringify(parsedStats))
        }

        localStorage.setItem("giftRedeemed", "true")
        setIsGiftRedeemed(true)

        // Show the Balance Received popup after updating balance
        setShowBalanceReceivedPopup(true)

        console.log(`✅ Updated balance: ${newBalance}`)
      } catch (error) {
        console.error("Error updating balance:", error)
      }
    }, 1500)
  }

  const handleCloseCallTutorial = () => {
    setShowCallTutorial(false)
    // Now trigger the audio flow
    if (!isSingleAudioSent) {
      setTimeout(() => {
        sendSingleAudio()
        setWaitingForResponse(false)
      }, 1000) // Shorter delay after tutorial
    }
  }

  // Handle call button click
  const handleCallButtonClick = () => {
    // Hide tutorial and permanently disable call button
    setShowCallTutorial(false)
    setIsCallButtonPermanentlyDisabled(true)
    setIsCallPopupOpen(true)
  }

  // Handle call popup close
  const handleCallPopupClose = () => {
    setIsCallPopupOpen(false)
    // Fix: Reset waiting state to ensure send button works properly
    setWaitingForResponse(false)
    // Note: Call button remains permanently disabled

    // Add missed call message
    const missedCallMessage: Message = {
      id: Date.now() + Math.random(),
      sender: "them",
      text: "Llamada de voz perdida",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMissedCall: true,
    }

    setMessages((prev) => [...prev, missedCallMessage])

    // After 2 seconds, trigger single audio message
    setTimeout(() => {
      if (!isSingleAudioSent) {
        sendSingleAudio()
      }
    }, 2000)
  }

  const handleProVersionUnlock = () => {
    setShowProVersionPopup(false)
    onNavigate("upsell1")
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
        <MessageSquare className="w-16 h-16 text-[#E469B3] animate-pulse mb-4" />
        <h1 className="text-2xl font-bold mb-2">Cargando Chat</h1>
        <p className="text-gray-400 text-center">Conectando con tu match...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-black overflow-hidden" style={{ height: "100dvh" }}>
      <CallTutorialOverlay isOpen={showCallTutorial && !isCallPopupOpen} onClose={handleCloseCallTutorial} />
      {/* Money Animation */}
      <MoneyAnimation
        isVisible={showMoneyAnimation}
        onComplete={() => setShowMoneyAnimation(false)}
        startPosition={animationPositions.start}
        endPosition={animationPositions.end}
      />

      {/* Fullscreen Video Player */}
      <FullscreenVideoPlayer
        isOpen={showFullscreenVideo}
        videoUrl="/video-011.mp4"
        onClose={() => setShowFullscreenVideo(false)}
        onVideoEnd={handleVideoEnd}
      />

      {/* Header - Removed back arrow */}
      <div className="sticky top-0 z-10 bg-black border-b border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <div className="relative">
              <div className="h-12 w-12 overflow-hidden rounded-full">
                <Image
                  src={profile.photo || "/placeholder.svg"}
                  alt={profile.name}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    console.error("Profile image failed to load")
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
              </div>
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border border-black" />
            </div>

            <div className="ml-3">
              <div className="flex items-center">
                <h2 className="text-lg font-semibold text-white">{profile.name}</h2>
                {showRecordingStatus && (
                  <div className="ml-2 flex items-center bg-gray-800 rounded-full px-3 py-1">
                    <div className="h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse" />
                    <span className="text-sm text-white">Grabando</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-400">Activo ahora</p>
            </div>
          </div>

          <div className="flex items-center gap-2 relative">
            <Button
              id="call-button"
              onClick={handleCallButtonClick}
              size="icon"
              variant="ghost"
              disabled={isCallButtonPermanentlyDisabled}
              className={cn(
                "text-white hover:bg-gray-800 z-20",
                showCallTutorial && "pulse-glow-animation",
                isCallButtonPermanentlyDisabled && "opacity-50 cursor-not-allowed",
              )}
            >
              <Phone className="h-6 w-6" />
            </Button>
            <div className="text-green-400 font-bold bg-gradient-to-r from-green-600/20 to-green-500/10 px-3 py-1 rounded-full">
              {currencyLoaded ? formatCurrency(balance.replace("$", "")) : balance}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 bg-black">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-center my-2">
            <div className="px-4 py-1 rounded-full bg-gray-800 text-sm text-gray-400 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Hoy
            </div>
          </div>

          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {msg.isGiftIcon ? (
                  <div onClick={handleGiftClick} className="cursor-pointer">
                    {/* Gift Icon Message */}
                    <div className="w-full max-w-xs mx-auto">
                      <div className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-xl p-4 border border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.25)] overflow-hidden">
                        <div className="flex items-center gap-3 relative z-10">
                          <div className="relative flex-shrink-0">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
                              <Gift className="h-6 w-6 text-white" />
                            </div>
                          </div>

                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">
                              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                                {profile.name}
                              </span>{" "}
                              te envié un regalo
                            </p>
                            <div className="mt-1">
                              <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300">
                                {currencyLoaded ? formatCurrency(randomGiftAmount) : `$${randomGiftAmount}`}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3">
                          <button className="w-full relative overflow-hidden rounded-full py-2 text-sm font-medium text-white shadow-md bg-gradient-to-r from-pink-500 to-purple-600 shadow-pink-500/20">
                            <span className="relative z-10">
                              {isGiftRedeemed ? "Regalo reclamado" : "Haz clic para reclamar tu regalo"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <ChatMessage
                    id={msg.id}
                    sender={msg.sender}
                    text={msg.text}
                    isVoice={msg.isVoice}
                    audioUrl={msg.audioUrl}
                    duration={msg.duration}
                    time={msg.time}
                    profileImage={msg.sender === "me" ? userPhoto : profile.photo}
                    onAudioComplete={() => handleAudioComplete(msg.id)}
                    onAudioProgress={(currentTime) => handleAudioProgress(msg.audioId || msg.id, currentTime)}
                    isAudioCompleted={audioCompletions[msg.id] || false}
                    audioId={msg.audioId || msg.id}
                    isMissedCall={msg.isMissedCall}
                    isVideo={msg.isVideo}
                    videoUrl={msg.videoUrl}
                    hasBeenPlayed={msg.hasBeenPlayed}
                    onVideoClick={handleVideoClick}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {showGiftNotification && (
            <GiftNotification
              name={profile.name}
              onClick={() => {
                setShowGiftNotification(false)
                setShowGiftPopup(true)
                try {
                  localStorage.setItem("hasSeenGift", "true")
                  localStorage.setItem("interactionsAfterGift", "0")
                } catch (error) {
                  console.error("Error saving gift status:", error)
                }
              }}
              onClose={() => {
                setShowGiftNotification(false)
                if (!messages.some((msg) => msg.isGiftIcon)) {
                  const giftMsg: Message = {
                    id: 6,
                    sender: "them",
                    isGiftIcon: true,
                    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  }
                  setMessages((prev) => [...prev, giftMsg])
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800 bg-black p-3 pb-safe">
        {isRecording ? (
          <div className="flex items-center rounded-full bg-gray-800 px-4 py-3">
            <div className="mr-3 flex-1">
              <div className="flex items-center h-10 bg-gray-700/50 rounded-full px-3">
                <div className="flex-1 flex items-center space-x-[1.5px]">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: [3 + Math.random() * 2, 12 + Math.random() * 10, 3 + Math.random() * 2],
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.02,
                      }}
                      className="w-[2.5px] bg-gradient-to-t from-pink-500 to-pink-400 rounded-full"
                    />
                  ))}
                </div>
              </div>

              <div className="mt-1.5 text-xs text-white/70 flex items-center">
                <div className="h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse" />
                {`${Math.floor(recordingTime / 60)}:${(recordingTime % 60).toString().padStart(2, "0")}`}
              </div>
            </div>

            <Button
              onClick={toggleRecording}
              size="icon"
              variant="ghost"
              className="h-10 w-10 rounded-full text-red-500 hover:bg-gray-700"
              disabled={waitingForResponse}
            >
              <Pause className="h-6 w-6" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !waitingForResponse && sendMessage()}
                placeholder={waitingForResponse ? "Esperando respuesta..." : "Mensaje..."}
                className="rounded-full bg-gray-800 py-6 pl-5 pr-12 text-white text-base border-gray-700 focus:border-pink-500"
                disabled={waitingForResponse}
                onFocus={(e) => {
                  // Show Pro Version popup if video question has been sent and popup hasn't been shown this session
                  if (hasVideoQuestionBeenSent && !proPopupShownThisSession) {
                    setShowProVersionPopup(true)
                    setProPopupShownThisSession(true)
                  }
                  // Prevent any audio interruption when focusing on input
                  e.preventDefault()
                }}
              />
            </div>

            {newMessage && !waitingForResponse ? (
              <Button
                onClick={sendMessage}
                size="icon"
                className="h-12 w-12 rounded-full bg-pink-600 hover:bg-pink-700"
              >
                <Send className="h-6 w-6" />
              </Button>
            ) : waitingForResponse ? (
              <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center">
                <div className="h-5 w-5 rounded-full border-2 border-gray-500 border-t-transparent animate-spin" />
              </div>
            ) : (
              <Button
                onClick={toggleRecording}
                size="icon"
                className="h-12 w-12 rounded-full bg-pink-600 hover:bg-pink-700"
                disabled={waitingForResponse}
              >
                <Mic className="h-6 w-6" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Gift Popup */}
      <AnimatePresence>
        {showGiftPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <GiftPopup
              onClick={handleGiftClaim}
              name={profile.name}
              amount={randomGiftAmount}
              photo={profile.photo}
              formatCurrency={formatCurrency}
              currencyLoaded={currencyLoaded}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Balance Received Popup */}
      <AnimatePresence>
        {showBalanceReceivedPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <BalanceReceivedPopup
              onClick={handleRequestWithdrawal}
              onClose={() => setShowBalanceReceivedPopup(false)}
              finalBalance={balance}
              giftAmount={randomGiftAmount}
              formatCurrency={formatCurrency}
              currencyLoaded={currencyLoaded}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pro Version Popup - exactly matching the reference image */}
      <AnimatePresence>
        {showProVersionPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(6px)",
            }}
          >
            <ProVersionPopup onUnlock={handleProVersionUnlock} />
          </motion.div>
        )}
      </AnimatePresence>

      <VoiceCallPopup
        isOpen={isCallPopupOpen}
        onClose={handleCallPopupClose}
        profileName={profile.name}
        profileImageUrl={profile.photo}
        callingSoundUrl="/calling1.mp3"
      />
    </div>
  )
}

// Dummy data for profiles
const PROFILES_DATA: MatchedProfile[] = [
  {
    id: 1,
    name: "Daniela S",
    photo: "/profile-new1.jpeg",
    age: 28,
    bio: "I love traveling, seeing new places and interesting people. Let's talk?",
    tags: ["Travel", "Music", "Gastronomy"],
  },
  {
    id: 2,
    name: "Sofia G",
    photo: "/profile-new2.jpeg",
    age: 24,
    bio: "I'm a student and I'm looking for new friends. I love to dance and go out.",
    tags: ["Dance", "Parties", "Friends"],
  },
  {
    id: 3,
    name: "Valentina R",
    photo: "/profile-new3.jpeg",
    age: 32,
    bio: "I'm a professional photographer and I love to capture the beauty of the world.",
    tags: ["Photography", "Art", "Nature"],
  },
]

const handleRequestWithdrawal = () => {
  alert("Withdrawal requested!")
}

export default ChatScreen
