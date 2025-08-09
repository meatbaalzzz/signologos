import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { Link } from 'react-router-dom'

const Home: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Hero section animations
    if (heroRef.current) {
      const tl = gsap.timeline()
      tl.fromTo(heroRef.current.querySelector('.hero-title'), 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      )
      .fromTo(heroRef.current.querySelector('.hero-subtitle'), 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5'
      )
      .fromTo(heroRef.current.querySelector('.hero-buttons'), 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3'
      )
    }

    // Features animation on scroll
    if (featuresRef.current) {
      const features = featuresRef.current.querySelectorAll('.feature-card')
      gsap.fromTo(features, 
        { opacity: 0, y: 50, scale: 0.9 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.8, 
          ease: 'power3.out',
          stagger: 0.2,
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-50 via-dark-100 to-dark-200">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/20 to-accent-900/20"></div>
          {/* Animated particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary-400/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Main Title */}
            <h1 className="hero-title text-5xl md:text-7xl font-display font-bold mb-6">
              <span className="text-gradient bg-gradient-to-r from-primary-400 via-accent-400 to-primary-600 bg-clip-text text-transparent">
                SIGNOLOGOS
              </span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle text-xl md:text-2xl text-dark-300 mb-4 max-w-3xl mx-auto">
              La palabra hecha signo
            </p>

            {/* Description */}
            <p className="hero-subtitle text-lg text-dark-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Traductor basado en la web potenciado con IA de lengua a signo. 
              Utilizando tecnología avanzada de Computer Vision y Machine Learning 
              para hacer la comunicación más accesible.
            </p>

            {/* Action Buttons */}
            <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/traductor">
                <motion.button
                  className="btn-primary px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Comenzar Traducción
                </motion.button>
              </Link>

              <Link to="/acerca">
                <motion.button
                  className="btn-outline px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Conocer Más
                </motion.button>
              </Link>
            </div>

            {/* Tech Stack Indicators */}
            <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-60">
              <TechBadge name="React 18+" />
              <TechBadge name="TypeScript" />
              <TechBadge name="MediaPipe" />
              <TechBadge name="TensorFlow.js" />
              <TechBadge name="WebRTC" />
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-primary-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary-400 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-dark-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              Características Principales
            </h2>
            <p className="text-xl text-dark-400 max-w-2xl mx-auto">
              Tecnología de vanguardia para una experiencia de traducción sin precedentes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="🎥"
              title="Detección en Tiempo Real"
              description="Captura y procesa gestos de lengua de señas en tiempo real con latencia menor a 100ms"
              features={["WebRTC optimizado", "30 FPS de procesamiento", "Detección de 2 manos simultáneas"]}
            />

            <FeatureCard
              icon="🧠"
              title="IA Avanzada"
              description="Redes neuronales profundas con MediaPipe y TensorFlow.js para máxima precisión"
              features={["CNN + LSTM bidireccional", "21 landmarks por mano", "Precisión > 85%"]}
            />

            <FeatureCard
              icon="⚡"
              title="Rendimiento Optimizado"
              description="Aplicación web progresiva que funciona completamente en el navegador"
              features={["Sin servidor requerido", "Caché inteligente", "Modo offline"]}
            />

            <FeatureCard
              icon="🎨"
              title="Interfaz Moderna"
              description="Diseño responsivo con animaciones fluidas y experiencia de usuario excepcional"
              features={["Dark theme", "Animaciones GSAP", "Responsive design"]}
            />

            <FeatureCard
              icon="📊"
              title="Entrenamiento Personalizado"
              description="Recolecta y entrena con tus propios datos para mejorar la precisión"
              features={["Data augmentation", "Export/Import JSON", "Entrenamiento incremental"]}
            />

            <FeatureCard
              icon="🔧"
              title="Configuración Avanzada"
              description="Controles detallados para ajustar el comportamiento del sistema"
              features={["Filtros Kalman", "Umbrales ajustables", "Métricas en tiempo real"]}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-900/20 to-accent-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-display font-bold text-white mb-6">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-dark-300 mb-8">
            Experimenta el futuro de la traducción de lengua de señas
          </p>
          <Link to="/traductor">
            <motion.button
              className="btn-primary px-12 py-4 text-xl font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Probar Ahora
            </motion.button>
          </Link>
        </div>
      </section>
    </div>
  )
}

// Tech Badge Component
const TechBadge: React.FC<{ name: string }> = ({ name }) => (
  <motion.div
    className="px-4 py-2 bg-dark-200 rounded-full text-sm font-medium text-dark-400 border border-dark-300"
    whileHover={{ scale: 1.1, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
  >
    {name}
  </motion.div>
)

// Feature Card Component
const FeatureCard: React.FC<{
  icon: string
  title: string
  description: string
  features: string[]
}> = ({ icon, title, description, features }) => (
  <motion.div
    className="feature-card card p-8 hover:shadow-xl transition-all duration-300 group"
    whileHover={{ y: -5 }}
  >
    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors">
      {title}
    </h3>
    <p className="text-dark-400 mb-6 leading-relaxed">
      {description}
    </p>
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-sm text-dark-500">
          <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-3"></div>
          {feature}
        </li>
      ))}
    </ul>
  </motion.div>
)

export default Home
