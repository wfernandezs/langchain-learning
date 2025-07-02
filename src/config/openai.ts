import { getEnv, getEnvNumber } from "../utils/env";

/**
 * OpenAI-specific configuration
 */
export interface OpenAIConfig {
  API_KEY: string;
  MODEL: string;
  TEMPERATURE: number;
  MAX_TOKENS?: number;
  TIMEOUT?: number;
}

export const openai: OpenAIConfig = {
  API_KEY: getEnv("OPENAI_API_KEY"),
  MODEL: getEnv("OPENAI_MODEL", "gpt-3.5-turbo"),
  TEMPERATURE: getEnvNumber("OPENAI_TEMPERATURE", 0.7),
  MAX_TOKENS: getEnvNumber("OPENAI_MAX_TOKENS", 4096),
  TIMEOUT: getEnvNumber("OPENAI_TIMEOUT", 60000),
};

/**
 * Validate OpenAI configuration
 */
export function validateOpenAIConfig(): void {
  if (!openai.API_KEY) {
    throw new Error("OPENAI_API_KEY is required");
  }

  if (openai.TEMPERATURE < 0 || openai.TEMPERATURE > 2) {
    throw new Error("OPENAI_TEMPERATURE must be between 0 and 2");
  }

  console.log("✅ OpenAI configuration validated successfully");
}
