// Export API client
export { default as apiClient, BaseApiService } from "./apiClient";

// Export services
export * from "./userService";
export * from "./catalogService";
export * from "./metricsService";

// Re-export service instances for convenience
export { userService } from "./userService";
export { catalogService } from "./catalogService";
export { metricsService } from "./metricsService";
