// Export API client
export { default as apiClient, BaseApiService } from "./apiClient";

// Export services
export * from "./userService";
export * from "./catalogService";

// Re-export service instances for convenience
export { userService } from "./userService";
export { catalogService } from "./catalogService";
