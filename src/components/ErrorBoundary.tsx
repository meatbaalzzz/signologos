import React from 'react'
import type { ErrorBoundaryState, AppError } from '../types/index'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: AppError; resetError: () => void }>
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const appError: AppError = {
      code: 'REACT_ERROR',
      message: error.message,
      details: error.stack,
      timestamp: Date.now(),
      stack: error.stack
    }

    return {
      hasError: true,
      error: appError
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const appError: AppError = {
      code: 'REACT_ERROR_BOUNDARY',
      message: error.message,
      details: {
        error: error.stack,
        errorInfo: errorInfo.componentStack
      },
      timestamp: Date.now(),
      stack: error.stack
    }

    console.error('SIGNOLOGOS Error Boundary caught an error:', appError)

    // Log to external service in production
    if (import.meta.env.PROD) {
      // Here you could send to an error tracking service
      console.error('Production error logged:', appError)
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Custom fallback component
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-dark-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            <div className="card p-8 text-center">
              {/* Error Icon */}
              <div className="w-16 h-16 mx-auto mb-6 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <div className="text-red-600 dark:text-red-400 text-2xl font-bold">!</div>
              </div>

              {/* Error Title */}
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Algo salió mal
              </h1>

              {/* Error Message */}
              <p className="text-gray-600 dark:text-dark-400 mb-6">
                Ha ocurrido un error inesperado en SIGNOLOGOS. Nuestro equipo ha sido notificado.
              </p>

              {/* Error Details (only in development) */}
              {import.meta.env.DEV && this.state.error && (
                <div className="mb-6 p-4 bg-gray-100 dark:bg-dark-200 rounded-lg text-left">
                  <h3 className="font-semibold text-sm text-gray-700 dark:text-dark-300 mb-2">
                    Detalles del error (desarrollo):
                  </h3>
                  <code className="text-xs text-red-600 dark:text-red-400 break-all">
                    {this.state.error.message}
                  </code>
                  {this.state.error.stack && (
                    <pre className="text-xs text-gray-500 dark:text-dark-500 mt-2 overflow-auto max-h-32">
                      {this.state.error.stack}
                    </pre>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.resetError}
                  className="btn-primary px-6 py-3 rounded-xl font-medium transition-colors duration-200"
                >
                  Intentar de nuevo
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-outline px-6 py-3 rounded-xl font-medium transition-colors duration-200"
                >
                  Recargar página
                </button>
              </div>

              {/* Additional Help */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-dark-300">
                <p className="text-sm text-gray-500 dark:text-dark-500">
                  Si el problema persiste, puedes:
                </p>
                <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-dark-400">
                  <div>• Verificar tu conexión a internet</div>
                  <div>• Limpiar la caché del navegador</div>
                  <div>• Actualizar tu navegador</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Higher-order component for functional components
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: AppError; resetError: () => void }>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  return WrappedComponent
}

// Hook for error handling in functional components
export const useErrorHandler = () => {
  const [error, setError] = React.useState<AppError | null>(null)

  const handleError = React.useCallback((error: Error | AppError) => {
    const appError: AppError = 'code' in error ? error : {
      code: 'HOOK_ERROR',
      message: error.message,
      details: error.stack,
      timestamp: Date.now(),
      stack: error.stack
    }

    setError(appError)
    console.error('SIGNOLOGOS Error Handler:', appError)
  }, [])

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  // Throw error to be caught by ErrorBoundary
  if (error) {
    throw error
  }

  return { handleError, resetError }
}

export default ErrorBoundary
