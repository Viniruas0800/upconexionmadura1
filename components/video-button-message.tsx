"use client"
import { motion } from "framer-motion"

// Custom Icon component to replicate the design
const PlayOnceIcon = ({ played }: { played: boolean }) => (
  <div className={`relative w-5 h-5 sm:w-6 sm:h-6 ${played ? "opacity-50" : ""}`}>
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="white"
        strokeWidth="1.5"
        strokeDasharray="3 3" // Dashed circle
      />
      {!played && (
        <text
          x="50%"
          y="50%"
          dy=".3em" // Vertical alignment
          textAnchor="middle"
          fontSize="10"
          fontWeight="bold"
          fill="white"
        >
          1
        </text>
      )}
      {played && ( // Simple play icon for "played" state, or could be a checkmark
        <path d="M9.5 16V8L16.5 12L9.5 16Z" fill="white" />
      )}
    </svg>
  </div>
)

interface VideoButtonMessageProps {
  timestamp: string
  onClick: () => void
  hasBeenPlayed: boolean
}

export default function VideoButtonMessage({ timestamp, onClick, hasBeenPlayed }: VideoButtonMessageProps) {
  return (
    <motion.button
      onClick={!hasBeenPlayed ? onClick : undefined}
      disabled={hasBeenPlayed}
      className={`flex items-center space-x-2 sm:space-x-2.5 p-2.5 sm:p-3 rounded-xl rounded-bl-none shadow-md transition-all duration-200 ease-in-out w-auto max-w-[140px] sm:max-w-[160px]
        ${
          hasBeenPlayed
            ? "bg-[#202832] cursor-default" // Darker, less interactive style when played
            : "bg-[#2E3A48] hover:bg-[#384656] active:bg-[#28333F] cursor-pointer"
        }`}
      whileHover={!hasBeenPlayed ? { scale: 1.03 } : {}}
      whileTap={!hasBeenPlayed ? { scale: 0.98 } : {}}
      layout
    >
      <PlayOnceIcon played={hasBeenPlayed} />
      <span
        className={`font-semibold text-sm sm:text-base 
          ${hasBeenPlayed ? "text-neutral-400" : "text-white"}`}
      >
        Video
      </span>
      <span
        className={`ml-auto text-xs self-end pb-px
          ${hasBeenPlayed ? "text-neutral-500" : "text-neutral-400"}`}
      >
        {timestamp}
      </span>
    </motion.button>
  )
}
