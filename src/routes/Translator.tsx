import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import AnimatedLoader from '../components/AnimatedLoader'
import { useCameraState, useModelState, useCurrentPrediction } from '../stores/useAppStore'
import { useCameraActions, useModelActions, usePredictionActions } from '../stores/useAppStore'

const Translator: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [showSettings, setShowSettings] = useState(false)

  // Store state
  const cameraState = useCameraState()
  const modelState = useModelState()
  const currentPrediction = useCurrentPrediction()

  // Store actions
  const { setCameraState } = useCameraActions()
  const { setModelState } = useModelActions()
  const { setCurrentPrediction } = usePredictionActions()

  useEffect(() => {
    // Initialize the translator
    initializeTranslator()
  }, [])

  const initializeTranslator = async () => {
    try {
      setIsInitializing(true)
      
      // Initialize camera
      await initializeCamera()
      
      // Initialize ML model
      await initializeModel()
      
      setIsInitializing(false)
    } catch (error) {
      console.error('Error initializing translator:', error)
      setIsInitializing(false)
    }
  }

  const initializeCamera = async () => {
    try {
      setCameraState({ isLoading: true, error: null })
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
          facingMode: 'user'
        },
        audio: false
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      setCameraState({ 
        isActive: true, 
        isLoading: false, 
        stream,
        error: null 
      })
    } catch (error) {
      setCameraState({ 
        isLoading: false, 
        error: 'No se pudo acceder a la cámara. Verifica los permisos.' 
      })
    }
  }

  const initializeModel = async () => {
    try {
      setModelState({ isLoaded: false, error: null })
      
      // Simulate model loading (replace with actual MediaPipe/TensorFlow.js initialization)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setModelState({ 
        isLoaded: true, 
        error: null,
        modelVersion: '1.0.0'
      })
    } catch (error) {
      setModelState({ 
        error: 'Error cargando el modelo de IA' 
      })
    }
  }

  const toggleCamera = async () => {
    if (cameraState.isActive) {
      // Stop camera
      if (cameraState.stream) {
        cameraState.stream.getTracks().forEach(track => track.stop())
      }
      setCameraState({ isActive: false, stream: null })
    } else {
      // Start camera
      await initializeCamera()
    }
  }

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AnimatedLoader 
          message="Inicializando SIGNOLOGOS..."
          variant="pulse"
          size="lg"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Traductor de Lengua de Señas
          </h1>
          <p className="text-dark-400">
            Coloca tus manos frente a la cámara para comenzar la traducción
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Feed */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2"
          >
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Vista de Cámara
                </h2>
                <div className="flex items-center space-x-2">
                  <StatusIndicator 
                    status={cameraState.isActive ? 'active' : 'inactive'}
                    label="Cámara"
                  />
                  <StatusIndicator 
                    status={modelState.isLoaded ? 'active' : 'inactive'}
                    label="IA"
                  />
                </div>
              </div>

              <div className="relative bg-dark-200 rounded-xl overflow-hidden aspect-video">
                {cameraState.error ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-4">📷</div>
                      <p className="text-red-400 mb-4">{cameraState.error}</p>
                      <button
                        onClick={initializeCamera}
                        className="btn-primary px-4 py-2 rounded-lg"
                      >
                        Reintentar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      playsInline
                      muted
                    />
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full"
                    />
                    
                    {/* Overlay UI */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                        <div className="text-green-400 text-sm font-medium">
                          ● EN VIVO
                        </div>
                      </div>
                      
                      {currentPrediction && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-primary-600/90 backdrop-blur-sm rounded-lg px-4 py-2"
                        >
                          <div className="text-white font-semibold">
                            {currentPrediction.gestureId}
                          </div>
                          <div className="text-primary-100 text-sm">
                            {Math.round(currentPrediction.confidence * 100)}% confianza
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Bottom Controls */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-center">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={toggleCamera}
                          className={`p-3 rounded-full transition-colors ${
                            cameraState.isActive 
                              ? 'bg-red-600 hover:bg-red-700' 
                              : 'bg-green-600 hover:bg-green-700'
                          }`}
                        >
                          {cameraState.isActive ? '⏸️' : '▶️'}
                        </button>
                        
                        <button
                          onClick={() => setShowSettings(!showSettings)}
                          className="p-3 bg-dark-600 hover:bg-dark-700 rounded-full transition-colors"
                        >
                          ⚙️
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Translation Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Current Translation */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Traducción Actual
              </h3>
              
              {currentPrediction ? (
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-primary-400">
                    {currentPrediction.gestureId}
                  </div>
                  <div className="text-sm text-dark-400">
                    Confianza: {Math.round(currentPrediction.confidence * 100)}%
                  </div>
                  
                  {currentPrediction.alternatives && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-dark-300 mb-2">
                        Alternativas:
                      </h4>
                      <div className="space-y-1">
                        {currentPrediction.alternatives.slice(0, 3).map((alt, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-dark-400">{alt.gestureId}</span>
                            <span className="text-dark-500">
                              {Math.round(alt.confidence * 100)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">👋</div>
                  <p className="text-dark-400">
                    Realiza un gesto para ver la traducción
                  </p>
                </div>
              )}
            </div>

            {/* Performance Metrics */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Métricas
              </h3>
              
              <div className="space-y-3">
                <MetricItem label="FPS" value="30" />
                <MetricItem label="Latencia" value="45ms" />
                <MetricItem label="Precisión" value="87%" />
                <MetricItem label="Manos detectadas" value="2" />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Acciones Rápidas
              </h3>
              
              <div className="space-y-2">
                <button className="w-full btn-outline py-2 text-sm rounded-lg">
                  Calibrar Cámara
                </button>
                <button className="w-full btn-outline py-2 text-sm rounded-lg">
                  Entrenar Modelo
                </button>
                <button className="w-full btn-outline py-2 text-sm rounded-lg">
                  Exportar Datos
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Configuración
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SettingItem
                  label="Mostrar Landmarks"
                  type="toggle"
                  value={true}
                />
                <SettingItem
                  label="FPS Detección"
                  type="slider"
                  value={15}
                  min={5}
                  max={30}
                />
                <SettingItem
                  label="Umbral Confianza"
                  type="slider"
                  value={0.7}
                  min={0.1}
                  max={1.0}
                  step={0.1}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// Status Indicator Component
const StatusIndicator: React.FC<{
  status: 'active' | 'inactive' | 'error'
  label: string
}> = ({ status, label }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
      <span className="text-xs text-dark-400">{label}</span>
    </div>
  )
}

// Metric Item Component
const MetricItem: React.FC<{
  label: string
  value: string
}> = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-dark-400">{label}</span>
    <span className="text-sm font-medium text-white">{value}</span>
  </div>
)

// Setting Item Component
const SettingItem: React.FC<{
  label: string
  type: 'toggle' | 'slider'
  value: boolean | number
  min?: number
  max?: number
  step?: number
}> = ({ label, type, value, min, max, step }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-dark-300">{label}</label>
    {type === 'toggle' ? (
      <div className="flex items-center">
        <button className={`w-12 h-6 rounded-full transition-colors ${
          value ? 'bg-primary-600' : 'bg-dark-400'
        }`}>
          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>
    ) : (
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value as number}
        className="w-full"
      />
    )}
  </div>
)

export default Translator
