"use client"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, User, Lock, Eye, EyeOff } from "lucide-react"

interface RegistrationScreenProps {
  onNavigate: (
    screen: "home" | "login" | "registration" | "profile-setup" | "welcome" | "discover" | "chat" | "upsell1",
    chatId?: string,
  ) => void
}

export default function RegistrationScreen({ onNavigate }: RegistrationScreenProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
    validateField(name, value)
  }

  const validateField = (name: string, value: string) => {
    let error = ""
    switch (name) {
      case "fullName":
        if (value.length < 3) {
          error = "El nombre completo debe tener al menos 3 caracteres"
        }
        break
      case "email":
        if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Email inválido"
        }
        break
      case "password":
        if (value.length < 6) {
          error = "La contraseña debe tener al menos 6 caracteres"
        }
        break
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let isValid = true
    const newErrors = { ...errors }

    for (const key in formData) {
      validateField(key, formData[key as keyof typeof formData])
      if (errors[key as keyof typeof errors]) {
        isValid = false
      }
    }

    if (isValid) {
      onNavigate("profile-setup")
    }
  }

  return (
    <div
      className="flex flex-col items-center justify-center bg-black px-4 py-0 overflow-hidden"
      style={{ height: "100dvh", touchAction: "none" }}
    >
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-white text-center mb-4">Crear una Cuenta</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="fullName" className="text-white text-sm">
              Nombre Completo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex w-10 items-center justify-center">
                <User className="h-5 w-5 text-[#E469B3]" />
              </div>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Ingresa tu nombre completo"
                className="pl-10 bg-[#121218] border-gray-800 focus:border-[#E469B3] text-white rounded-md"
              />
            </div>
            {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
          </div>
          <div className="space-y-1">
            <label htmlFor="email" className="text-white text-sm">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex w-10 items-center justify-center">
                <Mail className="h-5 w-5 text-[#E469B3]" />
              </div>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="pl-10 bg-[#121218] border-gray-800 focus:border-[#E469B3] text-white rounded-md"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="text-white text-sm">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex w-10 items-center justify-center">
                <Lock className="h-5 w-5 text-[#E469B3]" />
              </div>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="pl-10 pr-10 bg-[#121218] border-gray-800 focus:border-[#E469B3] text-white rounded-md"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-[#E469B3]" />
                ) : (
                  <Eye className="h-5 w-5 text-[#E469B3]" />
                )}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
          </div>
          <Button type="submit" className="w-full bg-[#E469B3] hover:bg-[#D55AA4] text-white py-5 rounded-full mt-4">
            Continuar
          </Button>
        </form>
      </div>
    </div>
  )
}
