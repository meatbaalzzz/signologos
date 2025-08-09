// Global type definitions for SIGNOLOGOS

/// <reference types="vite/client" />

// Environment variables
interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_MEDIAPIPE_MODEL_PATH: string
  readonly VITE_MEDIAPIPE_MAX_HANDS: string
  readonly VITE_MEDIAPIPE_MIN_DETECTION_CONFIDENCE: string
  readonly VITE_MEDIAPIPE_MIN_TRACKING_CONFIDENCE: string
  readonly VITE_TFJS_BACKEND: string
  readonly VITE_TFJS_DEBUG: string
  readonly VITE_CAMERA_WIDTH: string
  readonly VITE_CAMERA_HEIGHT: string
  readonly VITE_CAMERA_FPS: string
  readonly VITE_MODEL_SEQUENCE_LENGTH: string
  readonly VITE_MODEL_LSTM_UNITS: string
  readonly VITE_MODEL_LEARNING_RATE: string
  readonly VITE_MODEL_BATCH_SIZE: string
  readonly VITE_DETECTION_FPS_LIMIT: string
  readonly VITE_CANVAS_OPTIMIZATION: string
  readonly VITE_MEMORY_CLEANUP_INTERVAL: string
  readonly VITE_PWA_ENABLED: string
  readonly VITE_PWA_CACHE_NAME: string
  readonly VITE_ANALYTICS_ENABLED: string
  readonly VITE_DEBUG_MODE: string
  readonly VITE_SHOW_FPS_COUNTER: string
  readonly VITE_SHOW_LANDMARKS: string
  readonly VITE_LOG_LEVEL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// MediaPipe Types
export interface HandLandmark {
  x: number
  y: number
  z: number
  visibility?: number
}

export interface HandLandmarks {
  landmarks: HandLandmark[]
  handedness: 'Left' | 'Right'
  confidence: number
}

export interface DetectionResult {
  hands: HandLandmarks[]
  timestamp: number
  frameId: number
}

// Camera and Media Types
export interface MediaStreamConstraints {
  video: {
    width: { ideal: number }
    height: { ideal: number }
    frameRate: { ideal: number }
    facingMode: 'user' | 'environment'
  }
  audio: boolean
}

export interface CameraState {
  isActive: boolean
  isLoading: boolean
  error: string | null
  stream: MediaStream | null
  deviceId?: string
  constraints: MediaStreamConstraints
}

export interface VideoStreamHookReturn {
  videoRef: React.RefObject<HTMLVideoElement>
  canvasRef: React.RefObject<HTMLCanvasElement>
  cameraState: CameraState
  startCamera: () => Promise<void>
  stopCamera: () => void
  switchCamera: () => Promise<void>
  captureFrame: () => ImageData | null
}

// Machine Learning Types
export interface GestureClass {
  id: string
  name: string
  description: string
  category: 'letter' | 'word' | 'phrase' | 'number'
}

export interface TrainingData {
  id: string
  gestureId: string
  sequence: HandLandmark[][]
  duration: number
  timestamp: number
  metadata: {
    userId?: string
    deviceInfo: string
    quality: number
  }
}

export interface ModelPrediction {
  gestureId: string
  confidence: number
  alternatives: Array<{
    gestureId: string
    confidence: number
  }>
  timestamp: number
}

export interface MLModelState {
  isLoaded: boolean
  isTraining: boolean
  isInferring: boolean
  error: string | null
  modelVersion: string
  accuracy?: number
  trainingProgress?: number
}

export interface MLModelHookReturn {
  modelState: MLModelState
  loadModel: () => Promise<void>
  trainModel: (data: TrainingData[]) => Promise<void>
  predict: (sequence: HandLandmark[][]) => Promise<ModelPrediction | null>
  exportModel: () => Promise<Blob>
  importModel: (modelData: Blob) => Promise<void>
}

// Kalman Filter Types
export interface KalmanFilterState {
  x: number[]
  P: number[][]
  Q: number[][]
  R: number[][]
  H: number[][]
  F: number[][]
}

export interface KalmanFilter {
  predict(): void
  update(measurement: number[]): void
  getState(): number[]
}

// Animation and UI Types
export interface AnimationConfig {
  duration: number
  easing: string
  delay?: number
  repeat?: number
  yoyo?: boolean
}

export interface LoadingState {
  isLoading: boolean
  progress?: number
  message?: string
  error?: string
}

export interface NotificationState {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  actions?: Array<{
    label: string
    action: () => void
  }>
}

// Store Types (Zustand)
export interface AppStore {
  // Camera state
  camera: CameraState
  setCameraState: (state: Partial<CameraState>) => void
  
  // ML Model state
  model: MLModelState
  setModelState: (state: Partial<MLModelState>) => void
  
  // Detection results
  detectionResults: DetectionResult[]
  addDetectionResult: (result: DetectionResult) => void
  clearDetectionResults: () => void
  
  // Predictions
  currentPrediction: ModelPrediction | null
  predictionHistory: ModelPrediction[]
  setCurrentPrediction: (prediction: ModelPrediction | null) => void
  addPredictionToHistory: (prediction: ModelPrediction) => void
  
  // UI state
  isLoading: boolean
  notifications: NotificationState[]
  setLoading: (loading: boolean) => void
  addNotification: (notification: Omit<NotificationState, 'id'>) => void
  removeNotification: (id: string) => void
  
  // Settings
  settings: {
    showLandmarks: boolean
    showFPS: boolean
    detectionFPS: number
    modelConfidenceThreshold: number
    enableDataCollection: boolean
    darkMode: boolean
  }
  updateSettings: (settings: Partial<AppStore['settings']>) => void
  
  // Training data
  trainingData: TrainingData[]
  addTrainingData: (data: TrainingData) => void
  removeTrainingData: (id: string) => void
  clearTrainingData: () => void
}

// Component Props Types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'neomorphic'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export interface CardProps extends BaseComponentProps {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T]

export type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never
}[keyof T]

// Error Types
export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: number
  stack?: string
}

export interface ErrorBoundaryState {
  hasError: boolean
  error?: AppError
}

// Performance Types
export interface PerformanceMetrics {
  fps: number
  detectionLatency: number
  predictionLatency: number
  memoryUsage: number
  cpuUsage?: number
}

// Data Export/Import Types
export interface ExportData {
  version: string
  timestamp: number
  trainingData: TrainingData[]
  modelMetadata?: {
    accuracy: number
    trainingEpochs: number
    modelSize: number
  }
  settings: AppStore['settings']
}

export interface ImportResult {
  success: boolean
  message: string
  importedCount?: number
  errors?: string[]
}

// WebRTC and Media Types
export interface MediaDeviceInfo {
  deviceId: string
  label: string
  kind: 'videoinput' | 'audioinput' | 'audiooutput'
}

export interface CameraCapabilities {
  width: { min: number; max: number }
  height: { min: number; max: number }
  frameRate: { min: number; max: number }
  facingMode: string[]
}

// Service Worker Types
export interface ServiceWorkerState {
  isSupported: boolean
  isRegistered: boolean
  isUpdateAvailable: boolean
  registration?: ServiceWorkerRegistration
}

// PWA Types
export interface PWAInstallPrompt {
  isInstallable: boolean
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

// Accessibility Types
export interface A11yConfig {
  announceDetections: boolean
  highContrast: boolean
  reducedMotion: boolean
  screenReaderOptimized: boolean
}

// Analytics Types (if enabled)
export interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp: number
}

// Development/Debug Types
export interface DebugInfo {
  buildVersion: string
  buildTime: string
  userAgent: string
  screenResolution: string
  devicePixelRatio: number
  supportedFeatures: {
    webgl: boolean
    webrtc: boolean
    serviceWorker: boolean
    indexedDB: boolean
  }
}

// Global augmentations
declare global {
  interface Window {
    // GSAP
    gsap?: any
    
    // Analytics (if enabled)
    gtag?: (...args: any[]) => void
    
    // PWA install prompt
    deferredPrompt?: any
    
    // Debug utilities
    SIGNOLOGOS_DEBUG?: {
      store: AppStore
      performance: PerformanceMetrics
      debugInfo: DebugInfo
    }
  }
  
  // Service Worker
  interface Navigator {
    serviceWorker: ServiceWorkerContainer
  }
}

export {}
