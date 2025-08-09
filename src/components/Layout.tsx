import React from 'react'
import { motion } from 'framer-motion'
import { useNotifications } from '../stores/useAppStore'
import { useNotificationActions } from '../stores/useAppStore'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const notifications = useNotifications()
  const { removeNotification } = useNotificationActions()

  return (
    <div className="min-h-screen bg-dark-50 text-white">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </main>

      {/* Notifications */}
      <NotificationContainer 
        notifications={notifications}
        onRemove={removeNotification}
      />

      {/* Footer */}
      <Footer />
    </div>
  )
}

// Header Component
const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-dark-50/80 backdrop-blur-md border-b border-dark-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <h1 className="text-xl font-display font-bold text-gradient">
              SIGNOLOGOS
            </h1>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="/" label="Inicio" />
            <NavLink href="/traductor" label="Traductor" />
            <NavLink href="/recoleccion" label="Datos" />
            <NavLink href="/configuracion" label="Configuración" />
            <NavLink href="/acerca" label="Acerca" />
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg hover:bg-dark-200 transition-colors">
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className="w-full h-0.5 bg-white"></div>
                <div className="w-full h-0.5 bg-white"></div>
                <div className="w-full h-0.5 bg-white"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

// Navigation Link Component
const NavLink: React.FC<{ href: string; label: string }> = ({ href, label }) => {
  const isActive = window.location.pathname === href

  return (
    <motion.a
      href={href}
      className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
        isActive 
          ? 'text-primary-400' 
          : 'text-dark-400 hover:text-white'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {label}
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full"
          layoutId="activeTab"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.a>
  )
}

// Notification Container
const NotificationContainer: React.FC<{
  notifications: any[]
  onRemove: (id: string) => void
}> = ({ notifications, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}

// Individual Notification Component
const Notification: React.FC<{
  notification: any
  onRemove: (id: string) => void
}> = ({ notification, onRemove }) => {
  const getNotificationStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 border-green-400'
      case 'error':
        return 'bg-red-500 border-red-400'
      case 'warning':
        return 'bg-yellow-500 border-yellow-400'
      default:
        return 'bg-blue-500 border-blue-400'
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '⚠'
      default:
        return 'ℹ'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
      className={`p-4 rounded-xl border-l-4 shadow-lg backdrop-blur-md ${getNotificationStyles(notification.type)} bg-opacity-90`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
          {getIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white">
            {notification.title}
          </h4>
          <p className="text-sm text-white/80 mt-1">
            {notification.message}
          </p>
          
          {notification.actions && (
            <div className="mt-3 flex space-x-2">
              {notification.actions.map((action: any, index: number) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <button
          onClick={() => onRemove(notification.id)}
          className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </motion.div>
  )
}

// Footer Component
const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-100 border-t border-dark-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h3 className="text-lg font-display font-bold text-gradient">
                SIGNOLOGOS
              </h3>
            </div>
            <p className="text-dark-400 text-sm">
              Traductor de lengua a signos potenciado con IA. 
              Haciendo la comunicación más accesible para todos.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Enlaces</h4>
            <div className="space-y-2 text-sm">
              <a href="/" className="block text-dark-400 hover:text-white transition-colors">
                Inicio
              </a>
              <a href="/traductor" className="block text-dark-400 hover:text-white transition-colors">
                Traductor
              </a>
              <a href="/recoleccion" className="block text-dark-400 hover:text-white transition-colors">
                Recolección de Datos
              </a>
              <a href="/configuracion" className="block text-dark-400 hover:text-white transition-colors">
                Configuración
              </a>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Información</h4>
            <div className="space-y-2 text-sm text-dark-400">
              <p>Versión: 1.0.0</p>
              <p>Licencia: GPL-3.0</p>
              <p>Tecnología: React + TypeScript</p>
              <p>IA: MediaPipe + TensorFlow.js</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-dark-300 text-center">
          <p className="text-dark-500 text-sm">
            © 2024 SIGNOLOGOS. Desarrollado con ❤️ para la accesibilidad.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Layout
