import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface AnimatedLoaderProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'pulse' | 'skeleton' | 'dots'
  className?: string
}

const AnimatedLoader: React.FC<AnimatedLoaderProps> = ({
  message = 'Cargando...',
  size = 'md',
  variant = 'spinner',
  className = ''
}) => {
  const loaderRef = useRef<HTMLDivElement>(null)
  const messageRef = useRef<HTMLParagraphElement>(null)

  // Size configurations
  const sizeConfig = {
    sm: { container: 'w-8 h-8', text: 'text-sm' },
    md: { container: 'w-12 h-12', text: 'text-base' },
    lg: { container: 'w-16 h-16', text: 'text-lg' }
  }

  useEffect(() => {
    if (!loaderRef.current) return

    let animation: gsap.core.Timeline

    switch (variant) {
      case 'spinner':
        animation = gsap.timeline({ repeat: -1 })
          .to(loaderRef.current, {
            rotation: 360,
            duration: 1,
            ease: 'none'
          })
        break

      case 'pulse':
        animation = gsap.timeline({ repeat: -1, yoyo: true })
          .to(loaderRef.current, {
            scale: 1.2,
            opacity: 0.7,
            duration: 0.8,
            ease: 'power2.inOut'
          })
        break

      case 'dots':
        const dots = loaderRef.current.children
        animation = gsap.timeline({ repeat: -1 })
        
        Array.from(dots).forEach((dot, index) => {
          animation.to(dot, {
            y: -10,
            duration: 0.3,
            ease: 'power2.out'
          }, index * 0.1)
          .to(dot, {
            y: 0,
            duration: 0.3,
            ease: 'power2.in'
          }, index * 0.1 + 0.3)
        })
        break

      case 'skeleton':
        animation = gsap.timeline({ repeat: -1 })
          .to(loaderRef.current, {
            backgroundPosition: '200% 0',
            duration: 1.5,
            ease: 'none'
          })
        break
    }

    // Animate message if present
    if (messageRef.current) {
      gsap.fromTo(messageRef.current, 
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.2 }
      )
    }

    return () => {
      animation?.kill()
    }
  }, [variant])

  const renderLoader = () => {
    const { container } = sizeConfig[size]

    switch (variant) {
      case 'spinner':
        return (
          <div
            ref={loaderRef}
            className={`${container} border-4 border-primary-200 border-t-primary-600 rounded-full`}
          />
        )

      case 'pulse':
        return (
          <div
            ref={loaderRef}
            className={`${container} bg-primary-600 rounded-full`}
          />
        )

      case 'dots':
        return (
          <div ref={loaderRef} className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 bg-primary-600 rounded-full ${size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : ''}`}
              />
            ))}
          </div>
        )

      case 'skeleton':
        return (
          <div
            ref={loaderRef}
            className={`${container} bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-dark-200 dark:via-dark-300 dark:to-dark-200 rounded-lg skeleton`}
            style={{
              backgroundSize: '200% 100%',
              backgroundPosition: '-200% 0'
            }}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {renderLoader()}
      
      {message && (
        <p
          ref={messageRef}
          className={`text-gray-600 dark:text-dark-400 font-medium ${sizeConfig[size].text}`}
        >
          {message}
        </p>
      )}
    </div>
  )
}

// Skeleton loader for content placeholders
export const SkeletonLoader: React.FC<{
  lines?: number
  className?: string
  animated?: boolean
}> = ({ lines = 3, className = '', animated = true }) => {
  const skeletonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!animated || !skeletonRef.current) return

    const elements = skeletonRef.current.querySelectorAll('.skeleton-line')
    
    const animation = gsap.timeline({ repeat: -1 })
      .to(elements, {
        backgroundPosition: '200% 0',
        duration: 1.5,
        ease: 'none',
        stagger: 0.1
      })

    return () => {
      animation.kill()
    }
  }, [animated])

  return (
    <div ref={skeletonRef} className={`space-y-3 ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <div
          key={i}
          className={`skeleton-line h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-dark-200 dark:via-dark-300 dark:to-dark-200 rounded ${
            i === lines - 1 ? 'w-3/4' : 'w-full'
          } ${animated ? 'skeleton' : ''}`}
          style={animated ? {
            backgroundSize: '200% 100%',
            backgroundPosition: '-200% 0'
          } : {}}
        />
      ))}
    </div>
  )
}

// Loading overlay component
export const LoadingOverlay: React.FC<{
  isVisible: boolean
  message?: string
  variant?: AnimatedLoaderProps['variant']
}> = ({ isVisible, message, variant = 'spinner' }) => {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!overlayRef.current) return

    if (isVisible) {
      gsap.to(overlayRef.current, {
        opacity: 1,
        visibility: 'visible',
        duration: 0.3,
        ease: 'power2.out'
      })
    } else {
      gsap.to(overlayRef.current, {
        opacity: 0,
        visibility: 'hidden',
        duration: 0.3,
        ease: 'power2.in'
      })
    }
  }, [isVisible])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      style={{ opacity: 0, visibility: 'hidden' }}
    >
      <div className="bg-white dark:bg-dark-100 rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4">
        <AnimatedLoader
          message={message}
          variant={variant}
          size="lg"
          className="py-4"
        />
      </div>
    </div>
  )
}

// Progress loader with percentage
export const ProgressLoader: React.FC<{
  progress: number
  message?: string
  className?: string
}> = ({ progress, message, className = '' }) => {
  const progressRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: `${Math.min(100, Math.max(0, progress))}%`,
        duration: 0.5,
        ease: 'power2.out'
      })
    }

    if (textRef.current) {
      gsap.to(textRef.current, {
        textContent: `${Math.round(progress)}%`,
        duration: 0.5,
        ease: 'none',
        snap: { textContent: 1 }
      })
    }
  }, [progress])

  return (
    <div className={`w-full ${className}`}>
      {message && (
        <p className="text-sm text-gray-600 dark:text-dark-400 mb-2 font-medium">
          {message}
        </p>
      )}
      
      <div className="w-full bg-gray-200 dark:bg-dark-300 rounded-full h-2 overflow-hidden">
        <div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: '0%' }}
        />
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-500 dark:text-dark-500">
          Progreso
        </span>
        <span
          ref={textRef}
          className="text-xs font-medium text-primary-600 dark:text-primary-400"
        >
          0%
        </span>
      </div>
    </div>
  )
}

export default AnimatedLoader
