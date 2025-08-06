"use client"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Heart } from "lucide-react"

interface ProfileCard {
  id: number
  name: string
  age: number
  image: string
  distance: string
  isOnline: boolean
  interests: string[]
  bio: string
}

interface MatchAnimationOverlayProps {
  userImage: string
  matchedProfile: ProfileCard
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      when: "beforeChildren",
      staggerChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", damping: 15, stiffness: 100 },
  },
}

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay: 1 },
  },
}

const FloatingHeart = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute"
    initial={{ y: 0, opacity: 0, scale: Math.random() * 0.5 + 0.5 }}
    animate={{
      y: -200,
      x: Math.random() * 100 - 50,
      opacity: [0, 1, 0],
      scale: Math.random() * 0.5 + 0.5,
      rotate: Math.random() * 180 - 90,
    }}
    transition={{
      duration: Math.random() * 2 + 2,
      ease: "easeInOut",
      delay,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "loop",
    }}
  >
    <Heart className="h-4 w-4 sm:h-6 sm:w-6 text-pink-500/50" fill="currentColor" />
  </motion.div>
)

const HeartFrame = ({
  image,
  alt,
  delay = 0,
  tiltDirection = "left",
  zIndex = 1,
}: {
  image: string
  alt: string
  delay?: number
  tiltDirection?: "left" | "right"
  zIndex?: number
}) => {
  // More pronounced tilts to match the reference image
  const tiltAngle = tiltDirection === "left" ? -15 : 15

  return (
    <motion.div
      className="absolute w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96"
      style={{ zIndex }}
      initial={{ scale: 0, rotate: tiltDirection === "left" ? -180 : 180 }}
      animate={{ scale: 1, rotate: tiltAngle }}
      transition={{
        type: "spring",
        damping: 15,
        stiffness: 100,
        delay: delay + 0.5,
        duration: 0.8,
      }}
    >
      {/* Heart-shaped container with SVG mask */}
      <div className="relative w-full h-full">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <defs>
            <clipPath id={`heart-clip-${alt}`}>
              <path d="M50,90 C50,90 10,60 10,35 C10,20 20,10 35,10 C42,10 50,15 50,25 C50,15 58,10 65,10 C80,10 90,20 90,35 C90,60 50,90 50,90 Z" />
            </clipPath>
          </defs>
        </svg>

        {/* Image with heart clipping - no borders or outlines */}
        <div className="w-full h-full" style={{ clipPath: `url(#heart-clip-${alt})` }}>
          <Image
            src={image || "/placeholder.svg"}
            alt={alt}
            fill
            className="object-cover"
            style={{ transform: "scale(1.15)" }} // Ensure full coverage within heart shape
          />
        </div>

        {/* Very subtle glow effect */}
        <div
          className="absolute inset-0 blur-2xl opacity-10"
          style={{
            background: "radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)",
            clipPath: `url(#heart-clip-${alt})`,
          }}
        />
      </div>
    </motion.div>
  )
}

export function MatchAnimationOverlay({ userImage, matchedProfile }: MatchAnimationOverlayProps) {
  // Remove the useEffect that was redirecting to /chat
  // The redirect is now handled in the discover page

  return (
    <AnimatePresence>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-4"
      >
        {/* Rest of the component remains the same */}
        {/* Floating hearts background */}
        {Array.from({ length: 15 }).map((_, i) => (
          <FloatingHeart key={i} delay={i * 0.2} />
        ))}

        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-8 sm:mb-12 md:mb-16 text-center"
          style={{
            background: "linear-gradient(45deg, #E469B3, #D55AA4, #C44B95)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "0 0 20px rgba(236, 72, 153, 0.5)",
            filter: "drop-shadow(0 0 10px rgba(236, 72, 153, 0.3))",
          }}
        >
          ¡Es un Match!
        </motion.h1>

        {/* Overlapping heart-shaped profile images positioned exactly like the reference */}
        <motion.div
          variants={itemVariants}
          className="relative flex items-center justify-center mb-8 sm:mb-12 md:mb-16"
          style={{ width: "400px", height: "300px" }} // Container to position hearts precisely
        >
          {/* Left heart (user) - positioned to the left and tilted left */}
          <div className="absolute" style={{ left: "0px", top: "50%", transform: "translateY(-50%)" }}>
            <HeartFrame image={userImage} alt="user-profile" delay={0.2} tiltDirection="left" zIndex={2} />
          </div>

          {/* Right heart (matched profile) - positioned to overlap and tilted right */}
          <div className="absolute" style={{ right: "0px", top: "50%", transform: "translateY(-50%)" }}>
            <HeartFrame
              image={matchedProfile.image}
              alt="matched-profile"
              delay={0.4}
              tiltDirection="right"
              zIndex={1}
            />
          </div>
        </motion.div>

        <motion.p variants={textVariants} className="text-base sm:text-lg md:text-xl text-gray-300 text-center px-4">
          Ahora puedes chatear con{" "}
          <span
            className="font-bold text-xl sm:text-2xl"
            style={{
              background: "linear-gradient(45deg, #E469B3, #D55AA4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {matchedProfile.name}
          </span>
          .
        </motion.p>
      </motion.div>
    </AnimatePresence>
  )
}
