import { getEnv, getEnvNumber } from "../utils/env";

/**
 * Environment-specific configuration
 */
export interface EnvironmentConfig {
  NODE_ENV: string;
  PORT: number;
  LOG_LEVEL: string;
}

export const environment: EnvironmentConfig = {
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: getEnvNumber("PORT", 3000),
  LOG_LEVEL: getEnv("LOG_LEVEL", "info"),
};

// Helper functions
export const isDevelopment = environment.NODE_ENV === "development";
export const isProduction = environment.NODE_ENV === "production";
export const isTest = environment.NODE_ENV === "test";
