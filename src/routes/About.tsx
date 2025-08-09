import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'

const About: React.FC = () => {
  const timelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (timelineRef.current) {
      const items = timelineRef.current.querySelectorAll('.timeline-item')
      gsap.fromTo(items, 
        { opacity: 0, x: -50 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.8, 
          stagger: 0.2,
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }
  }, [])

  return (
    <div className="min-h-screen bg-dark-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 to-accent-900/20" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              <span className="text-gradient">Acerca de SIGNOLOGOS</span>
            </h1>
            <p className="text-xl text-dark-300 mb-8 max-w-2xl mx-auto">
              Revolucionando la comunicación a través de la tecnología de 
              inteligencia artificial y computer vision
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-dark-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-display font-bold text-white mb-6">
                Nuestra Misión
              </h2>
              <p className="text-dark-300 text-lg leading-relaxed mb-6">
                SIGNOLOGOS nace con el propósito de hacer la comunicación más 
                accesible para la comunidad sorda y personas con discapacidad 
                auditiva. Utilizamos tecnología de vanguardia para crear un 
                puente entre la lengua de señas y el texto.
              </p>
              <p className="text-dark-300 text-lg leading-relaxed">
                Creemos que la tecnología debe servir para unir, no para dividir. 
                Por eso desarrollamos herramientas que funcionan completamente 
                en el navegador, respetando la privacidad y accesibilidad de 
                todos los usuarios.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Impacto Social</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">♿</span>
                    </div>
                    <span>Accesibilidad universal</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">🌍</span>
                    </div>
                    <span>Disponible globalmente</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">🔒</span>
                    </div>
                    <span>Privacidad garantizada</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">💡</span>
                    </div>
                    <span>Código abierto</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Tecnología de Vanguardia
            </h2>
            <p className="text-xl text-dark-400 max-w-2xl mx-auto">
              Combinamos las mejores tecnologías web modernas para crear 
              una experiencia única y poderosa
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TechCard
              title="MediaPipe"
              description="Detección de landmarks de manos en tiempo real con precisión submilimétrica"
              features={["21 puntos por mano", "Detección dual", "60 FPS"]}
              color="from-blue-500 to-blue-600"
            />

            <TechCard
              title="TensorFlow.js"
              description="Redes neuronales profundas ejecutándose directamente en el navegador"
              features={["CNN + LSTM", "WebGL acelerado", "Entrenamiento local"]}
              color="from-orange-500 to-orange-600"
            />

            <TechCard
              title="React + TypeScript"
              description="Interfaz moderna y robusta con tipado estático y componentes reutilizables"
              features={["Hooks modernos", "Tipado estricto", "Hot reload"]}
              color="from-cyan-500 to-cyan-600"
            />

            <TechCard
              title="WebRTC"
              description="Acceso directo a la cámara sin plugins ni instalaciones adicionales"
              features={["Acceso nativo", "Baja latencia", "Cross-platform"]}
              color="from-green-500 to-green-600"
            />

            <TechCard
              title="GSAP + Framer Motion"
              description="Animaciones fluidas y transiciones cinematográficas de alta performance"
              features={["60 FPS garantizado", "Hardware acelerado", "Micro-interacciones"]}
              color="from-purple-500 to-purple-600"
            />

            <TechCard
              title="PWA"
              description="Aplicación web progresiva que funciona offline y se instala como app nativa"
              features={["Modo offline", "Instalable", "Service Worker"]}
              color="from-pink-500 to-pink-600"
            />
          </div>
        </div>
      </section>

      {/* Development Timeline */}
      <section className="py-16 bg-dark-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Cronología de Desarrollo
            </h2>
            <p className="text-xl text-dark-400">
              El camino hacia una comunicación más accesible
            </p>
          </motion.div>

          <div ref={timelineRef} className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary-600" />

            <div className="space-y-8">
              <TimelineItem
                date="Q1 2024"
                title="Investigación y Conceptualización"
                description="Análisis de necesidades de la comunidad sorda y evaluación de tecnologías disponibles"
                status="completed"
              />

              <TimelineItem
                date="Q2 2024"
                title="Desarrollo del Prototipo"
                description="Implementación inicial con MediaPipe y primeras pruebas de detección de gestos"
                status="completed"
              />

              <TimelineItem
                date="Q3 2024"
                title="Integración de IA"
                description="Desarrollo del modelo de machine learning y optimización para navegadores"
                status="completed"
              />

              <TimelineItem
                date="Q4 2024"
                title="Interfaz de Usuario"
                description="Diseño y desarrollo de la interfaz moderna con animaciones y accesibilidad"
                status="current"
              />

              <TimelineItem
                date="Q1 2025"
                title="Beta Pública"
                description="Lanzamiento de la versión beta para pruebas con la comunidad"
                status="planned"
              />

              <TimelineItem
                date="Q2 2025"
                title="Lanzamiento Oficial"
                description="Versión 1.0 con todas las características principales implementadas"
                status="planned"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Desarrollado con Pasión
            </h2>
            <p className="text-xl text-dark-400 max-w-2xl mx-auto">
              SIGNOLOGOS es un proyecto de código abierto desarrollado por 
              la comunidad para la comunidad
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ContributorCard
              role="Desarrollo Frontend"
              description="Interfaz de usuario, animaciones y experiencia de usuario"
              technologies={["React", "TypeScript", "Tailwind CSS", "GSAP"]}
            />

            <ContributorCard
              role="Machine Learning"
              description="Modelos de IA, optimización y entrenamiento"
              technologies={["TensorFlow.js", "MediaPipe", "Python", "Computer Vision"]}
            />

            <ContributorCard
              role="Accesibilidad"
              description="Consultoría en accesibilidad y pruebas con usuarios"
              technologies={["WCAG", "Screen Readers", "UX Research", "Testing"]}
            />
          </div>
        </div>
      </section>

      {/* Open Source Section */}
      <section className="py-16 bg-gradient-to-r from-primary-900/20 to-accent-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-display font-bold text-white mb-6">
              Código Abierto
            </h2>
            <p className="text-xl text-dark-300 mb-8 max-w-2xl mx-auto">
              SIGNOLOGOS es completamente open source bajo licencia GPL-3.0. 
              Creemos en la transparencia y la colaboración comunitaria.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="https://github.com/signologos/signologos"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-8 py-3 rounded-xl font-semibold inline-flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Ver en GitHub</span>
              </motion.a>
              
              <motion.a
                href="https://github.com/signologos/signologos/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline px-8 py-3 rounded-xl font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contribuir
              </motion.a>
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-primary-400">GPL-3.0</div>
                <div className="text-sm text-dark-400">Licencia</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-400">100%</div>
                <div className="text-sm text-dark-400">Gratuito</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-400">0</div>
                <div className="text-sm text-dark-400">Tracking</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-400">∞</div>
                <div className="text-sm text-dark-400">Posibilidades</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

// Tech Card Component
const TechCard: React.FC<{
  title: string
  description: string
  features: string[]
  color: string
}> = ({ title, description, features, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    className="card p-6 hover:shadow-xl transition-all duration-300 group"
    whileHover={{ y: -5 }}
  >
    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
      <div className="w-6 h-6 bg-white rounded opacity-80" />
    </div>
    
    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
      {title}
    </h3>
    
    <p className="text-dark-400 mb-4 leading-relaxed">
      {description}
    </p>
    
    <ul className="space-y-1">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-sm text-dark-500">
          <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2" />
          {feature}
        </li>
      ))}
    </ul>
  </motion.div>
)

// Timeline Item Component
const TimelineItem: React.FC<{
  date: string
  title: string
  description: string
  status: 'completed' | 'current' | 'planned'
}> = ({ date, title, description, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'current': return 'bg-primary-500'
      case 'planned': return 'bg-dark-400'
    }
  }

  return (
    <div className="timeline-item relative flex items-start space-x-6">
      <div className={`relative z-10 w-4 h-4 rounded-full ${getStatusColor()} flex-shrink-0 mt-2`}>
        {status === 'current' && (
          <div className="absolute inset-0 rounded-full bg-primary-500 animate-ping" />
        )}
      </div>
      
      <div className="flex-1 pb-8">
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-sm font-medium text-primary-400">{date}</span>
          <span className={`px-2 py-1 text-xs rounded-full ${
            status === 'completed' ? 'bg-green-900/30 text-green-400' :
            status === 'current' ? 'bg-primary-900/30 text-primary-400' :
            'bg-dark-300 text-dark-500'
          }`}>
            {status === 'completed' ? 'Completado' : 
             status === 'current' ? 'En progreso' : 'Planificado'}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-dark-400">{description}</p>
      </div>
    </div>
  )
}

// Contributor Card Component
const ContributorCard: React.FC<{
  role: string
  description: string
  technologies: string[]
}> = ({ role, description, technologies }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    className="card p-6 text-center"
  >
    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full mx-auto mb-4 flex items-center justify-center">
      <span className="text-white text-2xl font-bold">👨‍💻</span>
    </div>
    
    <h3 className="text-lg font-semibold text-white mb-2">{role}</h3>
    <p className="text-dark-400 mb-4 text-sm">{description}</p>
    
    <div className="flex flex-wrap gap-2 justify-center">
      {technologies.map((tech, index) => (
        <span
          key={index}
          className="px-2 py-1 bg-dark-200 text-dark-400 text-xs rounded-full"
        >
          {tech}
        </span>
      ))}
    </div>
  </motion.div>
)

export default About
