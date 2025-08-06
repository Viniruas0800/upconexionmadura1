"use client"
import { useState, useEffect } from "react"
import CurrencyConverter from "@/lib/currency-converter"

export function useCurrency() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [converter] = useState(() => CurrencyConverter.getInstance())

  useEffect(() => {
    const initializeCurrency = async () => {
      try {
        await converter.initialize()
        setIsLoaded(true)
      } catch (error) {
        console.error("Failed to initialize currency:", error)
        setIsLoaded(true) // Still set to true to avoid infinite loading
      }
    }

    initializeCurrency()
  }, [converter])

  const formatCurrency = (usdAmount: number | string): string => {
    if (!isLoaded) return `$${usdAmount}` // Fallback while loading

    const amount = typeof usdAmount === "string" ? converter.parseUSDAmount(usdAmount) : usdAmount

    return converter.formatAmount(amount)
  }

  const convertAmount = (usdAmount: number | string): number => {
    if (!isLoaded) return typeof usdAmount === "string" ? converter.parseUSDAmount(usdAmount) : usdAmount

    const amount = typeof usdAmount === "string" ? converter.parseUSDAmount(usdAmount) : usdAmount

    return converter.convertAmount(amount)
  }

  const getCurrentCurrency = () => {
    return converter.getCurrentCurrency()
  }

  const formatCurrencyWithContext = (usdAmount: number | string, pageSlug?: string, checkoutUrl?: string): string => {
    if (!isLoaded) return `$${usdAmount}` // Fallback while loading

    const amount = typeof usdAmount === "string" ? converter.parseUSDAmount(usdAmount) : usdAmount

    // Use context-aware formatting for Hotmart offers
    if (pageSlug && checkoutUrl) {
      return converter.formatAmountWithContext(amount, pageSlug, checkoutUrl)
    }

    // Default formatting for all other cases
    return converter.formatAmount(amount)
  }

  const isHotmartOffer = (pageSlug: string, checkoutUrl?: string): boolean => {
    if (!isLoaded) return false
    return converter.isHotmartOffer(pageSlug, checkoutUrl)
  }

  const getHotmartFixedPrice = (pageSlug: string, checkoutUrl?: string): string | null => {
    if (!isLoaded) return null
    return converter.getHotmartFixedPrice(pageSlug, checkoutUrl)
  }

  return {
    formatCurrency,
    formatCurrencyWithContext,
    convertAmount,
    getCurrentCurrency,
    isLoaded,
    converter,
    isHotmartOffer,
    getHotmartFixedPrice,
  }
}
