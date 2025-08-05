"use client"

import { cn } from "@/lib/utils"

interface InterestTagProps {
  label: string
  selected: boolean
  onClick: () => void
  disabled?: boolean
}

export function InterestTag({ label, selected, onClick, disabled = false }: InterestTagProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "px-3 py-1.5 rounded-full text-sm transition-all",
        selected ? "bg-[#E469B3] text-white" : "bg-[#121218] text-gray-300 hover:bg-[#1a1e2e]",
        disabled && !selected && "opacity-50 cursor-not-allowed",
      )}
    >
      {label}
    </button>
  )
}
