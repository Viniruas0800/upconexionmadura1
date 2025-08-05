"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Volume2, XIcon } from "lucide-react"

interface VoiceCallPopupProps {
  isOpen: boolean
  onClose: () => void
  profileName: string
  profileImageUrl: string | null
  callingSoundUrl: string
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0, transition: { delay: 0.3 } },
}

const popupVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 25 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
}

export default function VoiceCallPopup({
  isOpen,
  onClose,
  profileName,
  profileImageUrl,
  callingSoundUrl,
}: VoiceCallPopupProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isSpeakerOn, setIsSpeakerOn] = useState(false) // Default to earpiece (simulated by low volume)

  useEffect(() => {
    let soundTimer: NodeJS.Timeout
    const audioEl = audioRef.current

    if (isOpen && audioEl) {
      // Set initial volume based on speaker state (default is earpiece/low volume)
      audioEl.volume = isSpeakerOn ? 1.0 : 0.3 // Use 0.3 for earpiece simulation
      audioEl.currentTime = 0
      audioEl.play().catch((error) => console.error("Error playing sound:", error))

      // Popup automatically closes after 5 seconds
      soundTimer = setTimeout(() => {
        onClose()
      }, 5000)
    } else if (audioEl) {
      audioEl.pause()
      audioEl.currentTime = 0
    }

    return () => {
      clearTimeout(soundTimer)
      if (audioEl) {
        audioEl.pause()
        audioEl.currentTime = 0
      }
    }
  }, [isOpen, onClose, isSpeakerOn])

  const handleSpeakerToggle = () => {
    setIsSpeakerOn((prevIsSpeakerOn) => {
      const newIsSpeakerOn = !prevIsSpeakerOn
      if (audioRef.current) {
        // Instantly change volume when toggling
        audioRef.current.volume = newIsSpeakerOn ? 1.0 : 0.3
      }
      return newIsSpeakerOn
    })
  }

  const handleHangUp = () => {
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[250] flex flex-col items-center justify-center bg-[#10030C] text-white p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="flex flex-col items-center justify-between h-full w-full max-w-md py-12"
            variants={popupVariants}
          >
            {/* Top section: Calling text and Profile Name */}
            <div className="text-center">
              <p className="text-neutral-300 text-lg mb-1">Llamando...</p>
              <h1 className="text-4xl sm:text-5xl font-bold">{profileName}</h1>
            </div>

            {/* Middle section: Profile Image */}
            <div className="my-8">
              <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-full overflow-hidden shadow-2xl border-4 border-white/10">
                <Image
                  src={profileImageUrl || "/placeholder.svg?height=240&width=240&query=profile+avatar"}
                  alt={profileName}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Bottom section: Action Buttons */}
            <div className="flex justify-center items-center space-x-12 sm:space-x-16 w-full">
              <div className="flex flex-col items-center">
                <button
                  onClick={handleSpeakerToggle}
                  className="w-20 h-20 sm:w-24 sm:h-24 bg-[#3A2F3F] rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
                  aria-label="Activar altavoz"
                >
                  <Volume2 className={`w-8 h-8 sm:w-10 sm:h-10 ${isSpeakerOn ? "text-red-400" : "text-white"}`} />
                </button>
                <span className="mt-2 text-sm sm:text-base text-neutral-200">Alta-voz</span>
              </div>
              <div className="flex flex-col items-center">
                <button
                  onClick={handleHangUp}
                  className="w-20 h-20 sm:w-24 sm:h-24 bg-[#FF3B30] rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
                  aria-label="Colgar llamada"
                >
                  <XIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={2.5} />
                </button>
                <span className="mt-2 text-sm sm:text-base text-neutral-200">Apagar</span>
              </div>
            </div>
          </motion.div>
          <audio ref={audioRef} src={callingSoundUrl} preload="auto" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
