import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ErrorBoundary from '@components/ErrorBoundary'
import Layout from '@components/Layout'
import AnimatedLoader from '@components/AnimatedLoader'

// Lazy load route components for better performance
const Home = lazy(() => import('./routes/Home'))
const Translator = lazy(() => import('./routes/Translator'))
const DataCollector = lazy(() => import('./routes/DataCollector'))
const Settings = lazy(() => import('./routes/Settings'))
const About = lazy(() => import('./routes/About'))

// Create QueryClient instance for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
})

// Loading fallback component
const RouteLoader: React.FC = () => (
  <div className="min-h-screen bg-dark-50 flex items-center justify-center">
    <AnimatedLoader message="Cargando módulo..." />
  </div>
)

// Main App component
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-dark-50 text-white">
          <ErrorBoundary>
            <Layout>
              <Suspense fallback={<RouteLoader />}>
                <Routes>
                  {/* Home route */}
                  <Route 
                    path="/" 
                    element={<Home />} 
                  />
                  
                  {/* Main translator interface */}
                  <Route 
                    path="/traductor" 
                    element={<Translator />} 
                  />
                  
                  {/* Data collection for training */}
                  <Route 
                    path="/recoleccion" 
                    element={<DataCollector />} 
                  />
                  
                  {/* Settings and configuration */}
                  <Route 
                    path="/configuracion" 
                    element={<Settings />} 
                  />
                  
                  {/* About page */}
                  <Route 
                    path="/acerca" 
                    element={<About />} 
                  />
                  
                  {/* 404 fallback */}
                  <Route 
                    path="*" 
                    element={
                      <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-8xl mb-4">🤔</div>
                          <h1 className="text-4xl font-bold mb-4">Página no encontrada</h1>
                          <p className="text-dark-400 mb-8">
                            La página que buscas no existe o ha sido movida.
                          </p>
                          <a 
                            href="/" 
                            className="btn-primary inline-flex items-center px-6 py-3 rounded-xl font-medium transition-colors duration-200"
                          >
                            Volver al inicio
                          </a>
                        </div>
                      </div>
                    } 
                  />
                </Routes>
              </Suspense>
            </Layout>
          </ErrorBoundary>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
