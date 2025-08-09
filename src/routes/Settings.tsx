import React from 'react'
import { motion } from 'framer-motion'
import { useSettings, useSettingsActions } from '../stores/useAppStore'

const Settings: React.FC = () => {
  const settings = useSettings()
  const { updateSettings } = useSettingsActions()

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    updateSettings({ [key]: value })
  }

  return (
    <div className="min-h-screen bg-dark-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Configuración
          </h1>
          <p className="text-dark-400">
            Personaliza el comportamiento de SIGNOLOGOS
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Detection Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-6">
              Configuración de Detección
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SettingToggle
                label="Mostrar Landmarks"
                description="Muestra los puntos de referencia de las manos detectadas"
                value={settings.showLandmarks}
                onChange={(value) => handleSettingChange('showLandmarks', value)}
              />

              <SettingToggle
                label="Mostrar FPS"
                description="Muestra el contador de frames por segundo"
                value={settings.showFPS}
                onChange={(value) => handleSettingChange('showFPS', value)}
              />

              <SettingSlider
                label="FPS de Detección"
                description="Velocidad de procesamiento (menor = menos CPU)"
                value={settings.detectionFPS}
                min={5}
                max={30}
                step={1}
                unit="fps"
                onChange={(value) => handleSettingChange('detectionFPS', value)}
              />

              <SettingSlider
                label="Umbral de Confianza"
                description="Nivel mínimo de confianza para mostrar predicciones"
                value={settings.modelConfidenceThreshold}
                min={0.1}
                max={1.0}
                step={0.1}
                unit=""
                format={(value) => `${Math.round(value * 100)}%`}
                onChange={(value) => handleSettingChange('modelConfidenceThreshold', value)}
              />

              <SettingToggle
                label="Recolección de Datos"
                description="Permite capturar datos para entrenamiento"
                value={settings.enableDataCollection}
                onChange={(value) => handleSettingChange('enableDataCollection', value)}
              />
            </div>
          </motion.div>

          {/* Appearance Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-6">
              Apariencia
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SettingToggle
                label="Modo Oscuro"
                description="Interfaz con colores oscuros (recomendado)"
                value={settings.darkMode}
                onChange={(value) => handleSettingChange('darkMode', value)}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-dark-300">
                  Tema de Color
                </label>
                <select className="w-full bg-dark-200 border border-dark-300 rounded-lg px-3 py-2 text-white">
                  <option value="blue">Azul (Predeterminado)</option>
                  <option value="purple">Púrpura</option>
                  <option value="green">Verde</option>
                  <option value="orange">Naranja</option>
                </select>
                <p className="text-xs text-dark-500">
                  Color principal de la interfaz
                </p>
              </div>
            </div>
          </motion.div>

          {/* Performance Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-6">
              Rendimiento
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-dark-300">
                  Calidad de Video
                </label>
                <select className="w-full bg-dark-200 border border-dark-300 rounded-lg px-3 py-2 text-white">
                  <option value="720p">720p (Recomendado)</option>
                  <option value="1080p">1080p (Alta calidad)</option>
                  <option value="480p">480p (Rendimiento)</option>
                </select>
                <p className="text-xs text-dark-500">
                  Resolución de la cámara
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-dark-300">
                  Backend de IA
                </label>
                <select className="w-full bg-dark-200 border border-dark-300 rounded-lg px-3 py-2 text-white">
                  <option value="webgl">WebGL (Recomendado)</option>
                  <option value="cpu">CPU (Compatibilidad)</option>
                  <option value="webgpu">WebGPU (Experimental)</option>
                </select>
                <p className="text-xs text-dark-500">
                  Motor de procesamiento de IA
                </p>
              </div>

              <SettingToggle
                label="Optimización de Canvas"
                description="Mejora el rendimiento del renderizado"
                value={true}
                onChange={() => {}}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-dark-300">
                  Intervalo de Limpieza de Memoria
                </label>
                <input
                  type="number"
                  min="1000"
                  max="10000"
                  step="1000"
                  defaultValue="5000"
                  className="w-full bg-dark-200 border border-dark-300 rounded-lg px-3 py-2 text-white"
                />
                <p className="text-xs text-dark-500">
                  Frecuencia de limpieza en milisegundos
                </p>
              </div>
            </div>
          </motion.div>

          {/* Privacy & Data */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-6">
              Privacidad y Datos
            </h2>

            <div className="space-y-6">
              <div className="bg-dark-200 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">
                  Procesamiento Local
                </h3>
                <p className="text-sm text-dark-400">
                  SIGNOLOGOS procesa todos los datos localmente en tu navegador. 
                  No se envía información a servidores externos.
                </p>
              </div>

              <SettingToggle
                label="Guardar Configuración"
                description="Mantiene tus preferencias entre sesiones"
                value={true}
                onChange={() => {}}
              />

              <div className="flex space-x-4">
                <button className="btn-outline px-4 py-2 text-sm rounded-lg">
                  Exportar Configuración
                </button>
                <button className="btn-outline px-4 py-2 text-sm rounded-lg">
                  Importar Configuración
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm rounded-lg transition-colors">
                  Restablecer Todo
                </button>
              </div>
            </div>
          </motion.div>

          {/* Advanced Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-6">
              Configuración Avanzada
            </h2>

            <div className="space-y-6">
              <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-yellow-400">⚠️</span>
                  <h3 className="font-semibold text-yellow-400">
                    Configuración Experimental
                  </h3>
                </div>
                <p className="text-sm text-yellow-200">
                  Estas opciones pueden afectar el rendimiento o la estabilidad.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SettingToggle
                  label="Modo Debug"
                  description="Muestra información de depuración en la consola"
                  value={false}
                  onChange={() => {}}
                />

                <SettingToggle
                  label="Métricas Detalladas"
                  description="Recopila estadísticas de rendimiento avanzadas"
                  value={false}
                  onChange={() => {}}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-dark-300">
                    Filtro Kalman - Q
                  </label>
                  <input
                    type="number"
                    min="0.001"
                    max="1"
                    step="0.001"
                    defaultValue="0.01"
                    className="w-full bg-dark-200 border border-dark-300 rounded-lg px-3 py-2 text-white"
                  />
                  <p className="text-xs text-dark-500">
                    Ruido del proceso (menor = más suave)
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-dark-300">
                    Filtro Kalman - R
                  </label>
                  <input
                    type="number"
                    min="0.001"
                    max="1"
                    step="0.001"
                    defaultValue="0.1"
                    className="w-full bg-dark-200 border border-dark-300 rounded-lg px-3 py-2 text-white"
                  />
                  <p className="text-xs text-dark-500">
                    Ruido de medición (menor = más sensible)
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* System Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-6">
              Información del Sistema
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem label="Versión" value="1.0.0" />
              <InfoItem label="Navegador" value={navigator.userAgent.split(' ')[0]} />
              <InfoItem label="Resolución" value={`${window.screen.width}x${window.screen.height}`} />
              <InfoItem label="Pixel Ratio" value={window.devicePixelRatio.toString()} />
              <InfoItem label="WebGL" value={getWebGLSupport() ? "Soportado" : "No soportado"} />
              <InfoItem label="WebRTC" value={navigator.mediaDevices ? "Soportado" : "No soportado"} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// Setting Toggle Component
const SettingToggle: React.FC<{
  label: string
  description: string
  value: boolean
  onChange: (value: boolean) => void
}> = ({ label, description, value, onChange }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-dark-300">{label}</label>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          value ? 'bg-primary-600' : 'bg-dark-400'
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
            value ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
    <p className="text-xs text-dark-500">{description}</p>
  </div>
)

// Setting Slider Component
const SettingSlider: React.FC<{
  label: string
  description: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  format?: (value: number) => string
  onChange: (value: number) => void
}> = ({ label, description, value, min, max, step, unit, format, onChange }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-dark-300">{label}</label>
      <span className="text-sm text-white">
        {format ? format(value) : `${value}${unit}`}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-dark-400 rounded-lg appearance-none cursor-pointer slider"
    />
    <p className="text-xs text-dark-500">{description}</p>
  </div>
)

// Info Item Component
const InfoItem: React.FC<{
  label: string
  value: string
}> = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-dark-400">{label}</span>
    <span className="text-sm font-medium text-white">{value}</span>
  </div>
)

// Helper function to check WebGL support
const getWebGLSupport = (): boolean => {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

export default Settings
