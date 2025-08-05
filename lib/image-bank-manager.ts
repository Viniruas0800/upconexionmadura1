/**
 * ImageBankManager - Handles cycling through profile images
 * Ensures each image is shown only once per cycle with localStorage persistence
 */

export class ImageBankManager {
  private static readonly STORAGE_KEY_AVAILABLE = "imageBank_available"
  private static readonly STORAGE_KEY_USED = "imageBank_used"
  private static readonly STORAGE_KEY_CYCLE_COUNT = "imageBank_cycleCount"

  // All available profile images
  private static readonly IMAGE_BANK = [
    "/profile-images/01.jpg",
    "/profile-images/02.jpg",
    "/profile-images/03.jpg",
    "/profile-images/04.jpg",
    "/profile-images/05.jpg",
    "/profile-images/06.jpg",
    "/profile-images/07.jpg",
    "/profile-images/08.jpg",
    "/profile-images/09.jpg",
    "/profile-images/10.jpg",
  ]

  /**
   * Initialize the image bank system
   */
  private static initializeBank(): void {
    if (typeof window === "undefined") return

    const available = localStorage.getItem(this.STORAGE_KEY_AVAILABLE)
    const used = localStorage.getItem(this.STORAGE_KEY_USED)

    // If no data exists or data is corrupted, initialize fresh cycle
    if (!available || !used) {
      this.resetCycle()
    }
  }

  /**
   * Reset the cycle - all images become available again
   */
  private static resetCycle(): void {
    if (typeof window === "undefined") return

    localStorage.setItem(this.STORAGE_KEY_AVAILABLE, JSON.stringify([...this.IMAGE_BANK]))
    localStorage.setItem(this.STORAGE_KEY_USED, JSON.stringify([]))

    // Increment cycle count for tracking
    const currentCycle = Number.parseInt(localStorage.getItem(this.STORAGE_KEY_CYCLE_COUNT) || "0", 10)
    localStorage.setItem(this.STORAGE_KEY_CYCLE_COUNT, (currentCycle + 1).toString())
  }

  /**
   * Get available images from localStorage
   */
  private static getAvailableImages(): string[] {
    if (typeof window === "undefined") return [...this.IMAGE_BANK]

    try {
      const available = localStorage.getItem(this.STORAGE_KEY_AVAILABLE)
      return available ? JSON.parse(available) : [...this.IMAGE_BANK]
    } catch (error) {
      console.error("Error parsing available images:", error)
      return [...this.IMAGE_BANK]
    }
  }

  /**
   * Get used images from localStorage
   */
  private static getUsedImages(): string[] {
    if (typeof window === "undefined") return []

    try {
      const used = localStorage.getItem(this.STORAGE_KEY_USED)
      return used ? JSON.parse(used) : []
    } catch (error) {
      console.error("Error parsing used images:", error)
      return []
    }
  }

  /**
   * Save available and used images to localStorage
   */
  private static saveState(available: string[], used: string[]): void {
    if (typeof window === "undefined") return

    localStorage.setItem(this.STORAGE_KEY_AVAILABLE, JSON.stringify(available))
    localStorage.setItem(this.STORAGE_KEY_USED, JSON.stringify(used))
  }

  /**
   * Get the next random image from the bank
   * Ensures no duplicates within a cycle
   */
  public static getNextImage(): string {
    this.initializeBank()

    let available = this.getAvailableImages()
    let used = this.getUsedImages()

    // If no images are available, reset the cycle
    if (available.length === 0) {
      console.log("🔄 Image bank cycle completed! Resetting...")
      this.resetCycle()
      available = this.getAvailableImages()
      used = this.getUsedImages()
    }

    // Select random image from available ones
    const randomIndex = Math.floor(Math.random() * available.length)
    const selectedImage = available[randomIndex]

    // Move selected image from available to used
    available.splice(randomIndex, 1)
    used.push(selectedImage)

    // Save updated state
    this.saveState(available, used)

    console.log(`📸 Selected image: ${selectedImage}`)
    console.log(`📊 Remaining in cycle: ${available.length}/10`)

    return selectedImage
  }

  /**
   * Get current cycle statistics
   */
  public static getCycleStats(): {
    available: number
    used: number
    total: number
    cycleNumber: number
  } {
    if (typeof window === "undefined") {
      return { available: 10, used: 0, total: 10, cycleNumber: 1 }
    }

    this.initializeBank()

    const available = this.getAvailableImages().length
    const used = this.getUsedImages().length
    const cycleNumber = Number.parseInt(localStorage.getItem(this.STORAGE_KEY_CYCLE_COUNT) || "1", 10)

    return {
      available,
      used,
      total: this.IMAGE_BANK.length,
      cycleNumber,
    }
  }

  /**
   * Force reset the cycle (for testing/debugging)
   */
  public static forceReset(): void {
    console.log("🔄 Force resetting image bank cycle...")
    this.resetCycle()
  }

  /**
   * Check if an image has been used in current cycle
   */
  public static isImageUsed(imagePath: string): boolean {
    const used = this.getUsedImages()
    return used.includes(imagePath)
  }

  /**
   * Get all images in the bank
   */
  public static getAllImages(): string[] {
    return [...this.IMAGE_BANK]
  }
}
