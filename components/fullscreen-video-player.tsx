"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface FullscreenVideoPlayerProps {
  isOpen: boolean
  videoUrl: string
  onClose: () => void
  onVideoEnd: () => void
}

export default function FullscreenVideoPlayer({ isOpen, videoUrl, onClose, onVideoEnd }: FullscreenVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isOpen && videoRef.current) {
      const video = videoRef.current

      const handleLoadedData = () => {
        setIsLoading(false)
        video.play().catch(console.error)
      }

      const handleEnded = () => {
        onVideoEnd()
        setTimeout(() => {
          onClose()
        }, 500)
      }

      video.addEventListener("loadeddata", handleLoadedData)
      video.addEventListener("ended", handleEnded)

      return () => {
        video.removeEventListener("loadeddata", handleLoadedData)
        video.removeEventListener("ended", handleEnded)
      }
    }
  }, [isOpen, onClose, onVideoEnd])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          )}

          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            controls={false}
            playsInline
            muted={false}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
