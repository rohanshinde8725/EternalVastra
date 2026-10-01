import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import { API_BASE_URL, resolveImageUrl } from '../../api/products'

const defaultSlides = [
  {
    id: 1,
    bg: '/images/banner/banner-1.webp',
    title: 'Timeless Waves,',
    subtitle: 'Eternal Elegance',
    description: 'Discover our exquisite collection of sarees crafted with tradition, quality & love.',
    buttonText: 'Shop Now',
    link: '/shop',
    animationType: 'left-to-right', // Slide 1: Animates from Left to Right
  },
  {
    id: 2,
    bg: '/images/banner/banner-2.webp',
    title: 'Elegance for',
    subtitle: 'Every Celebration',
    description: 'From weddings to festive moments, explore sarees that make every occasion unforgettable.',
    buttonText: 'Shop Now',
    link: '/shop',
    animationType: 'top-to-bottom', // Slide 2: Animates from Top to Bottom
  },
  {
    id: 3,
    bg: '/images/banner/banner-3.webp',
    title: 'Designed for',
    subtitle: 'Modern Grace',
    description: 'Contemporary sarees crafted for the modern woman — effortless elegance for every day.',
    buttonText: 'Shop Now',
    link: '/shop',
    animationType: 'bottom-to-top', // Slide 3: Animates from Bottom to Top
  },
]

const animationList = ['left-to-right', 'top-to-bottom', 'bottom-to-top']

// Directional slide variants
const slideVariants = {
  // 1. Animate from Left to Right
  'left-to-right': {
    initial: { x: '-100%', y: 0, opacity: 0 },
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      x: '100%',
      y: 0,
      opacity: 0,
      transition: { duration: 0.6, ease: [0.36, 0, 0.66, -0.04] },
    },
  },
  // 2. Animate from Top to Bottom
  'top-to-bottom': {
    initial: { x: 0, y: '-100%', opacity: 0 },
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      x: 0,
      y: '100%',
      opacity: 0,
      transition: { duration: 0.6, ease: [0.36, 0, 0.66, -0.04] },
    },
  },
  // 3. Animate from Bottom to Top
  'bottom-to-top': {
    initial: { x: 0, y: '100%', opacity: 0 },
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      x: 0,
      y: '-100%',
      opacity: 0,
      transition: { duration: 0.6, ease: [0.36, 0, 0.66, -0.04] },
    },
  },
}

// Content element internal directional offsets
const getContentAnimation = (type, offset, delay) => {
  let initial = { opacity: 0 }
  if (type === 'left-to-right') initial = { x: -offset, y: 0, opacity: 0 }
  if (type === 'top-to-bottom') initial = { x: 0, y: -offset, opacity: 0 }
  if (type === 'bottom-to-top') initial = { x: 0, y: offset, opacity: 0 }

  return {
    initial,
    animate: { x: 0, y: 0, opacity: 1 },
    transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] },
  }
}

const Hero = () => {
  const [slides, setSlides] = useState(defaultSlides)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef(null)
  const isDraggingRef = useRef(false)

  const fetchLiveBanners = useCallback(() => {
    fetch(`${API_BASE_URL}/api/admin/banners`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const activeBanners = data.filter((b) => b.active !== false)
          if (activeBanners.length > 0) {
            setSlides(
              activeBanners.map((b, idx) => ({
                id: b._id || b.id || idx + 1,
                bg: resolveImageUrl(b.image || `/images/banner/banner-${(idx % 3) + 1}.webp`),
                title: b.title || 'Timeless Waves,',
                subtitle: b.subtitle || 'Eternal Elegance',
                description:
                  b.description ||
                  'Discover our exquisite collection of sarees crafted with tradition, quality & love.',
                buttonText: b.buttonText || 'Shop Now',
                link: b.link || '/shop',
                animationType: animationList[idx % animationList.length],
              }))
            )
          } else {
            setSlides(defaultSlides)
          }
        }
      })
      .catch(() => {
        // keep default
      })
  }, [])

  useEffect(() => {
    fetchLiveBanners()
    window.addEventListener('bannersUpdated', fetchLiveBanners)
    return () => {
      window.removeEventListener('bannersUpdated', fetchLiveBanners)
    }
  }, [fetchLiveBanners])

  const currentSlide = slides[currentIndex % slides.length] || defaultSlides[0]

  const nextSlide = useCallback(() => {
    setSlides((curr) => {
      if (curr.length === 0) return curr
      setCurrentIndex((prev) => (prev + 1) % curr.length)
      return curr
    })
  }, [])

  const prevSlide = useCallback(() => {
    setSlides((curr) => {
      if (curr.length === 0) return curr
      setCurrentIndex((prev) => (prev - 1 + curr.length) % curr.length)
      return curr
    })
  }, [])

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  // Swipe / Drag Handler for Mouse and Touch
  const handleDragEnd = (e, { offset, velocity }) => {
    const swipeThreshold = 40
    const velocityThreshold = 300

    if (offset.x < -swipeThreshold || velocity.x < -velocityThreshold) {
      nextSlide()
    } else if (offset.x > swipeThreshold || velocity.x > velocityThreshold) {
      prevSlide()
    }

    // Reset drag flag after microtask to prevent unintended click
    setTimeout(() => {
      isDraggingRef.current = false
    }, 80)
  }

  // Autoplay timer (3s duration with infinite loop, paused on hover/touch)
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        nextSlide()
      }, 3000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [nextSlide, isPaused, slides.length])

  return (
    <div
      className="w-full relative overflow-hidden bg-[#FEFAF8] select-none h-75 sm:h-100 md:h-125 lg:h-162.5 2xl:h-200 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={currentSlide.id || currentIndex}
          variants={slideVariants[currentSlide.animationType] || slideVariants['left-to-right']}
          initial="initial"
          animate="animate"
          exit="exit"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.25}
          onDragStart={() => {
            isDraggingRef.current = true
            setIsPaused(true)
          }}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 w-full h-full flex items-center px-5 md:px-16 lg:px-24 cursor-grab active:cursor-grabbing touch-pan-y"
        >
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none select-none">
            <motion.img
              src={currentSlide.bg}
              alt={currentSlide.title}
              draggable={false}
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = '/images/banner/banner-1.webp'
              }}
              initial={{ scale: 1.06 }}
              animate={{ scale: 1 }}
              transition={{ duration: 3, ease: 'easeOut' }}
              className="w-full h-full object-cover select-none pointer-events-none"
            />
          </div>

          {/* Slide Content */}
          <div className="w-full lg:w-[70%] lg:ml-10 relative z-10 pointer-events-none">
            {/* Heading */}
            <motion.h1
              {...getContentAnimation(currentSlide.animationType, 90, 0.2)}
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-[#74202D] leading-tight select-none"
            >
              {currentSlide.title} <br /> {currentSlide.subtitle}
            </motion.h1>

            {/* Paragraph */}
            <motion.p
              {...getContentAnimation(currentSlide.animationType, 70, 0.35)}
              className="w-full sm:w-[75%] md:w-[70%] my-3 sm:my-4 text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed select-none"
            >
              {currentSlide.description}
            </motion.p>

            {/* CTA Button */}
            <motion.div
              {...getContentAnimation(currentSlide.animationType, 50, 0.5)}
              className="pointer-events-auto"
            >
              <Link
                to={currentSlide.link}
                onClick={(e) => {
                  if (isDraggingRef.current) {
                    e.preventDefault()
                  }
                }}
              >
                <button className="bg-[#74202D] text-white uppercase py-2.5 px-6 sm:px-8 rounded-md hover:bg-white border-2 border-[#74202D] hover:text-[#74202D] cursor-pointer transition-all duration-300 text-xs sm:text-sm font-semibold shadow-xs active:scale-95">
                  {currentSlide.buttonText}
                </button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          prevSlide()
        }}
        aria-label="Previous Slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-[#74202D] text-[#74202D] hover:text-white shadow-md backdrop-blur-xs flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 opacity-0 hover:opacity-100 group-hover:opacity-100 sm:opacity-80"
      >
        <HiChevronLeft className="text-xl sm:text-2xl" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation()
          nextSlide()
        }}
        aria-label="Next Slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-[#74202D] text-[#74202D] hover:text-white shadow-md backdrop-blur-xs flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 opacity-0 hover:opacity-100 group-hover:opacity-100 sm:opacity-80"
      >
        <HiChevronRight className="text-xl sm:text-2xl" />
      </button>

      {/* Pagination Bullets */}
      <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-30 flex items-center justify-center gap-2.5">
        {slides.map((slide, index) => {
          const isActive = (currentIndex % slides.length) === index
          return (
            <button
              key={slide.id || index}
              onClick={(e) => {
                e.stopPropagation()
                goToSlide(index)
              }}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-400 cursor-pointer ${
                isActive ? 'w-8 bg-[#74202D] shadow-xs' : 'w-2.5 bg-[#74202D]/35 hover:bg-[#74202D]/70'
              }`}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Hero