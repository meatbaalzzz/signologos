import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {
  AppStore,
  CameraState,
  MLModelState,
  DetectionResult,
  ModelPrediction,
  NotificationState,
  TrainingData
} from '../types/index'

// Initial states
const initialCameraState: CameraState = {
  isActive: false,
  isLoading: false,
  error: null,
  stream: null,
  constraints: {
    video: {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: { ideal: 30 },
      facingMode: 'user'
    },
    audio: false
  }
}

const initialModelState: MLModelState = {
  isLoaded: false,
  isTraining: false,
  isInferring: false,
  error: null,
  modelVersion: '1.0.0'
}

const initialSettings = {
  showLandmarks: true,
  showFPS: false,
  detectionFPS: 15,
  modelConfidenceThreshold: 0.7,
  enableDataCollection: false,
  darkMode: true
}

// Create the store
export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Camera state
        camera: initialCameraState,
        setCameraState: (state: Partial<CameraState>) =>
          set(
            (prev) => ({
              camera: { ...prev.camera, ...state }
            }),
            false,
            'setCameraState'
          ),

        // ML Model state
        model: initialModelState,
        setModelState: (state: Partial<MLModelState>) =>
          set(
            (prev) => ({
              model: { ...prev.model, ...state }
            }),
            false,
            'setModelState'
          ),

        // Detection results
        detectionResults: [],
        addDetectionResult: (result: DetectionResult) =>
          set(
            (prev) => ({
              detectionResults: [
                ...prev.detectionResults.slice(-99), // Keep last 100 results
                result
              ]
            }),
            false,
            'addDetectionResult'
          ),
        clearDetectionResults: () =>
          set(
            { detectionResults: [] },
            false,
            'clearDetectionResults'
          ),

        // Predictions
        currentPrediction: null,
        predictionHistory: [],
        setCurrentPrediction: (prediction: ModelPrediction | null) =>
          set(
            { currentPrediction: prediction },
            false,
            'setCurrentPrediction'
          ),
        addPredictionToHistory: (prediction: ModelPrediction) =>
          set(
            (prev) => ({
              predictionHistory: [
                ...prev.predictionHistory.slice(-49), // Keep last 50 predictions
                prediction
              ]
            }),
            false,
            'addPredictionToHistory'
          ),

        // UI state
        isLoading: false,
        notifications: [],
        setLoading: (loading: boolean) =>
          set(
            { isLoading: loading },
            false,
            'setLoading'
          ),
        addNotification: (notification: Omit<NotificationState, 'id'>) => {
          const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          const newNotification: NotificationState = {
            ...notification,
            id,
            duration: notification.duration || 5000
          }
          
          set(
            (prev) => ({
              notifications: [...prev.notifications, newNotification]
            }),
            false,
            'addNotification'
          )

          // Auto-remove notification after duration
          if (newNotification.duration && newNotification.duration > 0) {
            setTimeout(() => {
              get().removeNotification(id)
            }, newNotification.duration)
          }
        },
        removeNotification: (id: string) =>
          set(
            (prev) => ({
              notifications: prev.notifications.filter(n => n.id !== id)
            }),
            false,
            'removeNotification'
          ),

        // Settings
        settings: initialSettings,
        updateSettings: (settings: Partial<AppStore['settings']>) =>
          set(
            (prev) => ({
              settings: { ...prev.settings, ...settings }
            }),
            false,
            'updateSettings'
          ),

        // Training data
        trainingData: [],
        addTrainingData: (data: TrainingData) =>
          set(
            (prev) => ({
              trainingData: [...prev.trainingData, data]
            }),
            false,
            'addTrainingData'
          ),
        removeTrainingData: (id: string) =>
          set(
            (prev) => ({
              trainingData: prev.trainingData.filter(d => d.id !== id)
            }),
            false,
            'removeTrainingData'
          ),
        clearTrainingData: () =>
          set(
            { trainingData: [] },
            false,
            'clearTrainingData'
          )
      }),
      {
        name: 'signologos-store',
        partialize: (state) => ({
          // Only persist settings and training data
          settings: state.settings,
          trainingData: state.trainingData,
          predictionHistory: state.predictionHistory.slice(-10) // Keep last 10 predictions
        }),
        version: 1,
        migrate: (persistedState: any, version: number) => {
          // Handle store migrations if needed
          if (version === 0) {
            // Migration from version 0 to 1
            return {
              ...persistedState,
              settings: { ...initialSettings, ...persistedState.settings }
            }
          }
          return persistedState
        }
      }
    ),
    {
      name: 'SIGNOLOGOS Store',
      enabled: import.meta.env.DEV
    }
  )
)

// Selectors for better performance
export const useCameraState = () => useAppStore((state) => state.camera)
export const useModelState = () => useAppStore((state) => state.model)
export const useDetectionResults = () => useAppStore((state) => state.detectionResults)
export const useCurrentPrediction = () => useAppStore((state) => state.currentPrediction)
export const usePredictionHistory = () => useAppStore((state) => state.predictionHistory)
export const useNotifications = () => useAppStore((state) => state.notifications)
export const useSettings = () => useAppStore((state) => state.settings)
export const useTrainingData = () => useAppStore((state) => state.trainingData)
export const useIsLoading = () => useAppStore((state) => state.isLoading)

// Action selectors
export const useCameraActions = () => useAppStore((state) => ({
  setCameraState: state.setCameraState
}))

export const useModelActions = () => useAppStore((state) => ({
  setModelState: state.setModelState
}))

export const useDetectionActions = () => useAppStore((state) => ({
  addDetectionResult: state.addDetectionResult,
  clearDetectionResults: state.clearDetectionResults
}))

export const usePredictionActions = () => useAppStore((state) => ({
  setCurrentPrediction: state.setCurrentPrediction,
  addPredictionToHistory: state.addPredictionToHistory
}))

export const useNotificationActions = () => useAppStore((state) => ({
  addNotification: state.addNotification,
  removeNotification: state.removeNotification
}))

export const useSettingsActions = () => useAppStore((state) => ({
  updateSettings: state.updateSettings
}))

export const useTrainingActions = () => useAppStore((state) => ({
  addTrainingData: state.addTrainingData,
  removeTrainingData: state.removeTrainingData,
  clearTrainingData: state.clearTrainingData
}))

export const useUIActions = () => useAppStore((state) => ({
  setLoading: state.setLoading
}))

// Debug utilities (only in development)
if (import.meta.env.DEV) {
  // Expose store to window for debugging
  (window as any).SIGNOLOGOS_DEBUG = {
    store: useAppStore.getState(),
    getStore: useAppStore.getState,
    setState: useAppStore.setState
  }
}

export default useAppStore
