import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import AnimatedLoader from '../components/AnimatedLoader'
import { useTrainingData, useTrainingActions } from '../stores/useAppStore'

const DataCollector: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [currentGesture, setCurrentGesture] = useState('')
  const [recordingProgress, setRecordingProgress] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<'letter' | 'word' | 'phrase' | 'number'>('letter')
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const trainingData = useTrainingData()
  const { addTrainingData, removeTrainingData, clearTrainingData } = useTrainingActions()

  const gestureCategories = {
    letter: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    word: ['Hola', 'Gracias', 'Por favor', 'Sí', 'No', 'Agua', 'Comida', 'Casa', 'Trabajo', 'Familia'],
    phrase: ['¿Cómo estás?', 'Me llamo...', 'Mucho gusto', '¿Dónde está?', 'No entiendo'],
    number: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  }

  const startRecording = async (gesture: string) => {
    try {
      setCurrentGesture(gesture)
      setIsRecording(true)
      setRecordingProgress(0)

      // Initialize camera if not already active
      if (!videoRef.current?.srcObject) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, frameRate: 30 },
          audio: false
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
      }

      // Simulate recording progress
      const duration = 3000 // 3 seconds
      const interval = 50
      let elapsed = 0

      const progressInterval = setInterval(() => {
        elapsed += interval
        const progress = (elapsed / duration) * 100
        setRecordingProgress(progress)

        if (elapsed >= duration) {
          clearInterval(progressInterval)
          completeRecording(gesture)
        }
      }, interval)

    } catch (error) {
      console.error('Error starting recording:', error)
      setIsRecording(false)
    }
  }

  const completeRecording = (gesture: string) => {
    // Simulate captured data
    const newTrainingData = {
      id: `training-${Date.now()}`,
      gestureId: gesture,
      sequence: [], // This would contain actual landmark data
      duration: 3000,
      timestamp: Date.now(),
      metadata: {
        deviceInfo: navigator.userAgent,
        quality: Math.random() * 0.3 + 0.7 // Random quality between 0.7-1.0
      }
    }

    addTrainingData(newTrainingData)
    setIsRecording(false)
    setRecordingProgress(0)
    setCurrentGesture('')
  }

  const exportData = () => {
    const exportData = {
      version: '1.0.0',
      timestamp: Date.now(),
      trainingData: trainingData,
      totalSamples: trainingData.length
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `signologos-training-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (data.trainingData && Array.isArray(data.trainingData)) {
          data.trainingData.forEach((item: any) => addTrainingData(item))
        }
      } catch (error) {
        console.error('Error importing data:', error)
      }
    }
    reader.readAsText(file)
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
            Recolección de Datos de Entrenamiento
          </h1>
          <p className="text-dark-400">
            Captura gestos para entrenar y mejorar el modelo de IA
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recording Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Feed */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">
                Vista de Grabación
              </h2>

              <div className="relative bg-dark-200 rounded-xl overflow-hidden aspect-video mb-4">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />

                {/* Recording Overlay */}
                {isRecording && (
                  <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-white mb-4">
                        {currentGesture}
                      </div>
                      <div className="text-white text-xl mb-4">
                        Grabando...
                      </div>
                      <div className="w-64 bg-dark-600 rounded-full h-2 mx-auto">
                        <div 
                          className="bg-red-500 h-2 rounded-full transition-all duration-100"
                          style={{ width: `${recordingProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Recording Indicator */}
                {isRecording && (
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <span className="text-white text-sm font-medium">REC</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="bg-dark-200 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">Instrucciones:</h3>
                <ul className="text-sm text-dark-400 space-y-1">
                  <li>• Colócate frente a la cámara con buena iluminación</li>
                  <li>• Mantén las manos visibles durante toda la grabación</li>
                  <li>• Realiza el gesto de forma clara y consistente</li>
                  <li>• La grabación durará 3 segundos automáticamente</li>
                </ul>
              </div>
            </motion.div>

            {/* Gesture Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">
                Seleccionar Gesto
              </h2>

              {/* Category Tabs */}
              <div className="flex space-x-2 mb-6">
                {Object.keys(gestureCategories).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category as any)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-600 text-white'
                        : 'bg-dark-200 text-dark-400 hover:bg-dark-300'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>

              {/* Gesture Grid */}
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {gestureCategories[selectedCategory].map((gesture) => {
                  const hasData = trainingData.some(data => data.gestureId === gesture)
                  
                  return (
                    <motion.button
                      key={gesture}
                      onClick={() => !isRecording && startRecording(gesture)}
                      disabled={isRecording}
                      className={`relative p-4 rounded-lg font-semibold transition-all ${
                        isRecording
                          ? 'bg-dark-300 text-dark-500 cursor-not-allowed'
                          : hasData
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-dark-200 hover:bg-dark-300 text-white'
                      }`}
                      whileHover={!isRecording ? { scale: 1.05 } : {}}
                      whileTap={!isRecording ? { scale: 0.95 } : {}}
                    >
                      {gesture}
                      {hasData && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full" />
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {/* Data Management */}
          <div className="space-y-6">
            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                Estadísticas
              </h3>
              
              <div className="space-y-4">
                <StatItem 
                  label="Total de muestras" 
                  value={trainingData.length.toString()} 
                />
                <StatItem 
                  label="Gestos únicos" 
                  value={new Set(trainingData.map(d => d.gestureId)).size.toString()} 
                />
                <StatItem 
                  label="Calidad promedio" 
                  value={`${Math.round(trainingData.reduce((acc, d) => acc + (d.metadata.quality || 0), 0) / trainingData.length * 100) || 0}%`} 
                />
                <StatItem 
                  label="Última captura" 
                  value={trainingData.length > 0 ? new Date(Math.max(...trainingData.map(d => d.timestamp))).toLocaleTimeString() : 'N/A'} 
                />
              </div>
            </motion.div>

            {/* Data Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                Gestión de Datos
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={exportData}
                  disabled={trainingData.length === 0}
                  className="w-full btn-primary py-2 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Exportar Datos ({trainingData.length})
                </button>
                
                <label className="w-full btn-outline py-2 text-sm rounded-lg cursor-pointer block text-center">
                  Importar Datos
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="hidden"
                  />
                </label>
                
                <button
                  onClick={clearTrainingData}
                  disabled={trainingData.length === 0}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Limpiar Todo
                </button>
              </div>
            </motion.div>

            {/* Recent Captures */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                Capturas Recientes
              </h3>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {trainingData
                  .sort((a, b) => b.timestamp - a.timestamp)
                  .slice(0, 10)
                  .map((data) => (
                    <div
                      key={data.id}
                      className="flex items-center justify-between p-3 bg-dark-200 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-white">
                          {data.gestureId}
                        </div>
                        <div className="text-xs text-dark-400">
                          {new Date(data.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-xs text-dark-400">
                          {Math.round((data.metadata.quality || 0) * 100)}%
                        </div>
                        <button
                          onClick={() => removeTrainingData(data.id)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                
                {trainingData.length === 0 && (
                  <div className="text-center py-8 text-dark-400">
                    No hay datos de entrenamiento
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Stat Item Component
const StatItem: React.FC<{
  label: string
  value: string
}> = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-dark-400">{label}</span>
    <span className="text-sm font-medium text-white">{value}</span>
  </div>
)

export default DataCollector
