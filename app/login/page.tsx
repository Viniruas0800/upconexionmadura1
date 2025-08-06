"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useViewportHeight } from "@/hooks/use-viewport-height"

export default function LoginPage() {
  useViewportHeight()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({
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
      case "email":
        if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Formato de email inválido"
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

  const getCurrentUrlParams = () => {
    if (typeof window === "undefined") return ""
    const searchParams = new URLSearchParams(window.location.search)
    return searchParams.toString() ? `?${searchParams.toString()}` : ""
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let isValid = true

    // Validate all fields
    Object.entries(formData).forEach(([key, value]) => {
      validateField(key, value)
      if (errors[key as keyof typeof errors]) {
        isValid = false
      }
    })

    if (isValid) {
      // Get current URL parameters
      const params = getCurrentUrlParams()

      // Redirect to profile setup with preserved parameters
      router.push(`/profile-setup${params}`)
    }
  }

  return (
    <div
      className="flex flex-col items-center justify-center bg-black relative overflow-hidden"
      style={{ height: "100dvh", touchAction: "none" }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <Image src="/background-grid.jpg" alt="" fill className="object-cover object-center md:object-top" priority />
          <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-red-600/75" />
        </div>
      </div>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-black/70 p-6 border border-[#E469B3]/30 backdrop-blur-sm mx-4">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-4">
            <span className="text-[#E469B3]">Conexión</span>
            <span className="text-white">Madura</span>
          </h1>

          <h2 className="mb-1 text-2xl font-bold text-white">Iniciar Sesión</h2>
          <p className="mb-4 text-center text-sm text-gray-400">
            Ingresa tu email y contraseña para acceder a tu cuenta.
          </p>

          <form onSubmit={handleSubmit} className="mt-4 w-full space-y-4">
            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex w-10 items-center justify-center">
                <Mail className="h-5 w-5 text-[#E469B3]" />
              </div>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="pl-10 bg-black/50 border-gray-800 focus:border-[#E469B3] text-white"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex w-10 items-center justify-center">
                <Lock className="h-5 w-5 text-[#E469B3]" />
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Contraseña"
                className="pl-10 pr-10 bg-black/50 border-gray-800 focus:border-[#E469B3] text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <div>
              <Button type="submit" className="mt-4 w-full bg-[#E469B3] py-6 text-lg font-semibold hover:opacity-90">
                Iniciar Sesión
              </Button>
            </div>

            {/* Registration Link */}
            <div className="text-center text-sm text-gray-400 mt-2">
              ¿No tienes cuenta?{" "}
              <Link href={`/cadastro${getCurrentUrlParams()}`} className="text-[#E469B3]">
                Registrarse
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
