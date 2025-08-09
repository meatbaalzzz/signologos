import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Error boundary for the entire application
class GlobalErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('SIGNOLOGOS Global Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-dark-100 rounded-2xl p-8 text-center shadow-neomorphic-dark">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Error en SIGNOLOGOS
            </h1>
            <p className="text-dark-500 mb-6">
              Ha ocurrido un error inesperado. Por favor, recarga la página para continuar.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
            >
              Recargar Aplicación
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Performance monitoring
const startTime = performance.now()

// Initialize React app
const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </React.StrictMode>
)

// Log initialization time
window.addEventListener('load', () => {
  const loadTime = performance.now() - startTime
  console.log(`SIGNOLOGOS React app initialized in ${loadTime.toFixed(2)}ms`)
})

// Register service worker for PWA functionality
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })
      
      console.log('Service Worker registered successfully:', registration.scope)
      
      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, prompt user to refresh
              if (confirm('Nueva versión disponible. ¿Deseas actualizar?')) {
                window.location.reload()
              }
            }
          })
        }
      })
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  })
}

// Handle online/offline status
window.addEventListener('online', () => {
  console.log('SIGNOLOGOS: Conexión restaurada')
})

window.addEventListener('offline', () => {
  console.log('SIGNOLOGOS: Modo offline activado')
})

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  // Cleanup any running processes, streams, or ML models
  console.log('SIGNOLOGOS: Cleaning up resources...')
})
