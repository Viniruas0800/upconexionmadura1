"use client"
import { useState, useEffect } from "react"
import type React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Camera, X, ChevronRight } from "lucide-react"
import { useViewportHeight } from "@/hooks/use-viewport-height"
import { InterestTag } from "@/components/interest-tag"

// Define the interests available for selection
const AVAILABLE_INTERESTS = [
  "Citas",
  "Amistad",
  "Casual",
  "Largo plazo",
  "Viajes",
  "Cenas",
  "Películas",
  "Música",
  "Aire libre",
  "Ejercicio",
  "Arte",
  "Lectura",
  "Cocina",
  "Baile",
  "Compras",
]

interface ProfileSetupScreenProps {
  onNavigate: (
    screen: "home" | "login" | "registration" | "profile-setup" | "welcome" | "discover" | "chat" | "upsell1",
    chatId?: string,
  ) => void
}

export default function ProfileSetupScreen({ onNavigate }: ProfileSetupScreenProps) {
  useViewportHeight()

  // Form state
  const [name, setName] = useState("")
  const [photos, setPhotos] = useState<string[]>([])
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validation state
  const [errors, setErrors] = useState({
    name: "",
    photos: "",
    interests: "",
  })

  // Load any existing data from localStorage on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile")
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile)
      setName(parsedProfile.name || "")
      setPhotos(parsedProfile.photos || [])
      setSelectedInterests(parsedProfile.interests || [])
    }
  }, [])

  // Handle name input change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    if (e.target.value.length < 2) {
      setErrors((prev) => ({ ...prev, name: "El nombre debe tener al menos 2 caracteres" }))
    } else {
      setErrors((prev) => ({ ...prev, name: "" }))
    }
  }

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files).map((file) => URL.createObjectURL(file))

      // Limit to 6 photos total
      const updatedPhotos = [...photos, ...newPhotos].slice(0, 6)
      setPhotos(updatedPhotos)

      if (updatedPhotos.length === 0) {
        setErrors((prev) => ({ ...prev, photos: "Por favor sube al menos una foto" }))
      } else {
        setErrors((prev) => ({ ...prev, photos: "" }))
      }
    }
  }

  // Handle removing a photo
  const handleRemovePhoto = (index: number) => {
    const updatedPhotos = [...photos]
    updatedPhotos.splice(index, 1)
    setPhotos(updatedPhotos)

    if (updatedPhotos.length === 0) {
      setErrors((prev) => ({ ...prev, photos: "Por favor sube al menos una foto" }))
    }
  }

  // Handle interest selection
  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((item) => item !== interest)
      } else {
        // Limit to 5 interests
        if (prev.length >= 5) return prev
        return [...prev, interest]
      }
    })
  }

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors = {
      name: name.length < 2 ? "El nombre debe tener al menos 2 caracteres" : "",
      photos: photos.length === 0 ? "Por favor sube al menos una foto" : "",
      interests: selectedInterests.length === 0 ? "Por favor selecciona al menos un interés" : "",
    }

    setErrors(newErrors)

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error !== "")) {
      return
    }

    setIsSubmitting(true)

    // Save profile data to localStorage
    const profileData = {
      name,
      photos,
      interests: selectedInterests,
    }

    localStorage.setItem("userProfile", JSON.stringify(profileData))

    // Navigate to welcome screen
    onNavigate("welcome")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative min-h-screen py-8 px-4">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1e2e]/80 to-black z-0"></div>

        <div className="relative z-10 max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center mb-2">Completa tu Perfil</h1>
          <p className="text-gray-400 text-center mb-6">
            Permite que otros sepan más sobre ti para encontrar los mejores matches
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                Tu Nombre de Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex w-10 items-center justify-center">
                  <User className="h-5 w-5 text-[#E469B3]" />
                </div>
                <Input
                  id="name"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Cómo quieres que te llamen"
                  className="pl-10 bg-[#121218] border-gray-800 focus:border-[#E469B3] text-white"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Tus Fotos <span className="text-gray-500 text-xs">(Hasta 6)</span>
              </label>

              <div className="grid grid-cols-3 gap-2">
                {/* Display uploaded photos */}
                {photos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden bg-[#121218] border border-gray-800"
                  >
                    <Image
                      src={photo || "/placeholder.svg"}
                      alt={`Foto de usuario ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-1 right-1 bg-black/70 rounded-full p-1"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}

                {/* Upload button */}
                {photos.length < 6 && (
                  <label className="aspect-square rounded-lg bg-[#121218] border border-gray-800 flex flex-col items-center justify-center cursor-pointer hover:bg-[#1a1e2e] transition-colors">
                    <Camera className="h-8 w-8 text-[#E469B3] mb-1" />
                    <span className="text-xs text-gray-400">Agregar Foto</span>
                    <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
                  </label>
                )}
              </div>

              {errors.photos && <p className="text-red-500 text-xs mt-1">{errors.photos}</p>}
              <p className="text-gray-500 text-xs">Agrega tus mejores fotos para aumentar tus posibilidades de match</p>
            </div>

            {/* Interests Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Tus Intereses <span className="text-gray-500 text-xs">(Selecciona hasta 5)</span>
              </label>

              <div className="flex flex-wrap gap-2">
                {AVAILABLE_INTERESTS.map((interest) => (
                  <InterestTag
                    key={interest}
                    label={interest}
                    selected={selectedInterests.includes(interest)}
                    onClick={() => handleInterestToggle(interest)}
                    disabled={selectedInterests.length >= 5 && !selectedInterests.includes(interest)}
                  />
                ))}
              </div>

              {errors.interests && <p className="text-red-500 text-xs mt-1">{errors.interests}</p>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#E469B3] hover:bg-[#D55AA4] text-white py-6 rounded-full text-lg font-semibold flex items-center justify-center gap-2"
            >
              <span>Continuar</span>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
