/**
 * Environment variable utilities
 */

/**
 * Get an environment variable with optional default value
 */
export function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (value !== undefined) {
    return value;
  }
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  throw new Error(`Environment variable ${key} is required but not set`);
}

/**
 * Get an environment variable as a number
 */
export function getEnvNumber(key: string, defaultValue?: number): number {
  const value = getEnv(key, defaultValue?.toString());
  const num = parseInt(value, 10);
  if (isNaN(num)) {
    throw new Error(`Environment variable ${key} must be a valid number`);
  }
  return num;
}

/**
 * Get an environment variable as a boolean
 */
export function getEnvBoolean(key: string, defaultValue?: boolean): boolean {
  const value = getEnv(key, defaultValue?.toString());
  return value.toLowerCase() === "true";
}

/**
 * Check if an environment variable is set
 */
export function hasEnv(key: string): boolean {
  return process.env[key] !== undefined;
}

/**
 * Validate that all required environment variables are present
 */
export function validateRequiredEnv(requiredVars: string[]): void {
  const missing: string[] = [];

  for (const varName of requiredVars) {
    if (!hasEnv(varName)) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

/**
 * Get environment variables for a specific prefix
 */
export function getEnvWithPrefix(prefix: string): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith(prefix) && value !== undefined) {
      result[key] = value;
    }
  }

  return result;
}
