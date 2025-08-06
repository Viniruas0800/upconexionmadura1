"use client"

import { motion } from "framer-motion"

interface AutomationSwitchProps {
  isActive: boolean
  onToggle: (active: boolean) => void
  disabled?: boolean
}

export default function AutomationSwitch({ isActive, onToggle, disabled = false }: AutomationSwitchProps) {
  return (
    <button
      id="automation-switch" // Add this ID for tutorial targeting
      onClick={() => !disabled && onToggle(!isActive)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 sm:h-7 sm:w-12 items-center rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
        isActive
          ? "bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/30"
          : "bg-neutral-700 hover:bg-neutral-600"
      }`}
      aria-label={`${isActive ? "Desactivar" : "Activar"} automatización de likes`}
    >
      <motion.span
        layout
        className={`inline-block h-4 w-4 sm:h-5 sm:w-5 transform rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
          isActive ? "translate-x-6 sm:translate-x-6" : "translate-x-1"
        }`}
        animate={{
          x: isActive ? (typeof window !== "undefined" && window.innerWidth >= 640 ? 24 : 22) : 4,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      />

      {/* Glow effect when active */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full bg-red-400/20 blur-sm"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1.2 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </button>
  )
}
