// Export API client
export { default as apiClient, BaseApiService } from './apiClient'

// Export services
export * from './userService'
export * from './musicService'

// Re-export service instances for convenience
export { userService } from './userService'
export { musicService } from './musicService'
