"use client"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

const CHECKOUT_URL = "https://pay.hotmart.com/V100751791G?off=8nixgdw6&checkoutMode=10"
const PROTECTED_ROUTES = ["/discover", "/chat"]

export function useBackRedirect() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Only apply back redirect on protected routes
    const isProtectedRoute = PROTECTED_ROUTES.some(route => 
      pathname === route || pathname.startsWith("/chat/")
    )

    if (!isProtectedRoute) {
      return
    }

    let isInternalNavigation = false

    // Handle browser back/forward navigation
    const handlePopState = (event: PopStateEvent) => {
      if (!isInternalNavigation) {
        event.preventDefault()
        window.location.href = CHECKOUT_URL
      }
    }

    // Handle page unload (tab close, refresh, navigation away)
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isInternalNavigation) {
        // For some browsers, we can redirect on beforeunload
        setTimeout(() => {
          window.location.href = CHECKOUT_URL
        }, 0)
      }
    }

    // Handle visibility change (tab switching, minimizing)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !isInternalNavigation) {
        // User might be closing tab or navigating away
        window.location.href = CHECKOUT_URL
      }
    }

    // Override history methods to detect internal navigation
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    history.pushState = function(...args) {
      isInternalNavigation = true
      setTimeout(() => { isInternalNavigation = false }, 100)
      return originalPushState.apply(history, args)
    }

    history.replaceState = function(...args) {
      isInternalNavigation = true
      setTimeout(() => { isInternalNavigation = false }, 100)
      return originalReplaceState.apply(history, args)
    }

    // Add event listeners
    window.addEventListener('popstate', handlePopState)
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup function
    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      
      // Restore original history methods
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
    }
  }, [pathname, router])

  // Function to mark internal navigation (for use in components)
  const markInternalNavigation = () => {
    // This can be called before internal navigation to prevent redirect
    const event = new CustomEvent('internalNavigation')
    window.dispatchEvent(event)
  }

  return { markInternalNavigation }
}
