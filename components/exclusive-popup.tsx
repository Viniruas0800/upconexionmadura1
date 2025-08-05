"use client"
import { useState, useEffect } from "react"
import { Crown, Gift, ChevronRight } from "lucide-react"

export function ExclusivePopup() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Popup is hidden - timer commented out
    // const timer = setTimeout(() => {
    //   setIsVisible(true)
    // }, 5000)
    // return () => clearTimeout(timer)
  }, [])

  const getCurrentUrlParams = () => {
    if (typeof window === "undefined") return ""
    const searchParams = new URLSearchParams(window.location.search)
    return searchParams.toString() ? `?${searchParams.toString()}` : ""
  }

  const closePopup = () => {
    setIsVisible(false)
  }

  const acceptInvite = () => {
    closePopup()
    const params = getCurrentUrlParams()
    window.location.href = `/cadastro${params}`
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-5 box-border">
      <div
        className="text-white rounded-[2rem] max-w-[400px] w-full relative overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.5)] pt-[30px] border border-[#ec4899]/20 backdrop-blur-md"
        style={{ backgroundColor: "rgba(27, 30, 47, 0.85)" }}
      >
        {/* Crown Icon */}
        <div className="flex justify-center mb-5">
          <div className="bg-[#ec4899] rounded-full w-16 h-16 flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.3),0_0_15px_rgba(236,72,153,0.5)] relative z-[1]">
            <Crown className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center px-6">
          <h2 className="text-2xl font-bold mb-2.5">Invitación Exclusiva</h2>
          <div className="flex justify-center mb-2.5">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-[#fbbf24] text-xl">
                ★
              </span>
            ))}
          </div>
          <p className="text-[#d1d5db] mb-6">Has sido seleccionado para acceder a nuestra plataforma exclusiva</p>
        </div>

        {/* Limited Opportunity Box */}
        <div className="bg-gradient-to-r from-[#211425] to-[#1a162f] mx-6 mb-6 rounded-lg p-4 border border-[#ec4899]/20">
          <div className="flex gap-3">
            <div className="bg-[#ec4899] rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0">
              <Gift className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold m-0 mb-1 text-white">Oportunidad Limitada</h3>
              <p className="text-sm text-[#a0a0b0] m-0">Solo 50 cupos disponibles hoy para nuevos miembros</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2 text-[#a0a0b0]">
              <span>Cupos Restantes</span>
              <span className="font-bold text-white">7</span>
            </div>
            <div className="h-2 bg-[#2a2e3e] rounded-full overflow-hidden">
              <div className="h-full w-0 bg-gradient-to-r from-[#ec4899] to-[#f472b6] animate-[fillProgress_1.5s_ease-out_forwards]" />
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="px-6 pb-6">
          <h3 className="font-semibold mb-3">Beneficios Exclusivos:</h3>
          <ul className="list-none p-0 m-0 flex flex-col gap-2">
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-[#ec4899] mt-0.5 flex-shrink-0" />
              <span className="text-sm text-[#d1d5db]">Acceso a perfiles premium de mujeres maduras</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-[#ec4899] mt-0.5 flex-shrink-0" />
              <span className="text-sm text-[#d1d5db]">Recibe regalos y transferencias de mujeres maduras</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-[#ec4899] mt-0.5 flex-shrink-0" />
              <span className="text-sm text-[#d1d5db]">Prioridad en matches y conversaciones</span>
            </li>
          </ul>
        </div>

        {/* Accept Button */}
        <div className="px-6 pb-4">
          <button
            onClick={acceptInvite}
            className="w-full bg-gradient-to-r from-[#ec4899] to-[#f472b6] text-white border-none rounded-full py-3 font-semibold text-base cursor-pointer transition-opacity duration-200 animate-[pulse_2s_infinite] shadow-[0_0_15px_rgba(236,72,153,0.4)] relative z-[1] hover:opacity-90"
          >
            Aceptar Invitación
          </button>
          <p className="text-center text-xs text-[#9ca3af] mt-2">Oferta por tiempo limitado</p>
        </div>

        {/* Close Button */}
        <div className="text-center pb-4">
          <button
            onClick={closePopup}
            className="bg-none border-none text-[#9ca3af] text-sm cursor-pointer transition-colors duration-200 hover:text-white"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
