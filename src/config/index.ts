import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import {
  validateRequiredEnv,
  getEnv,
  getEnvNumber,
  getEnvBoolean,
} from "../utils/env";
import {
  environment,
  isDevelopment,
  isProduction,
  type EnvironmentConfig,
} from "./environment";
import { openai, validateOpenAIConfig, type OpenAIConfig } from "./openai";

export interface AppConfig {
  environment: EnvironmentConfig;
  openai: OpenAIConfig;
}

export const config: AppConfig = {
  environment,
  openai,
};

export { environment, openai };
export { isDevelopment, isProduction };

// Pinecone config
export interface PineconeConfig {
  API_KEY: string;
  INDEX: string;
  ENVIRONMENT?: string;
}

export const pinecone: PineconeConfig = {
  API_KEY: getEnv("PINECONE_API_KEY"),
  INDEX: getEnv("PINECONE_INDEX"),
  ENVIRONMENT: getEnv("PINECONE_ENVIRONMENT", undefined),
};

export function validatePineconeConfig(): void {
  validateRequiredEnv(["PINECONE_API_KEY", "PINECONE_INDEX"]);
}

// Ingestion config
export interface IngestionConfig {
  TO_PINECONE: boolean;
  FILE_PATH?: string;
  CHUNK_SIZE: number;
  CHUNK_OVERLAP: number;
}

export const ingestion: IngestionConfig = {
  TO_PINECONE: getEnvBoolean("INGEST_TO_PINECONE", false),
  FILE_PATH: getEnv("INGEST_FILE_PATH", undefined),
  CHUNK_SIZE: getEnvNumber("INGEST_CHUNK_SIZE", 1000),
  CHUNK_OVERLAP: getEnvNumber("INGEST_CHUNK_OVERLAP", 0),
};

export function validateIngestionConfig(): void {
  if (ingestion.TO_PINECONE && !ingestion.FILE_PATH) {
    throw new Error(
      "INGEST_FILE_PATH is required when INGEST_TO_PINECONE is true"
    );
  }
}

export function validateConfig(): void {
  validateRequiredEnv(["OPENAI_API_KEY"]);
  validateOpenAIConfig();
  validatePineconeConfig();
  validateIngestionConfig();

  // Validate Tavily API key if using Tavily tools
  if (process.env.TAVILY_API_KEY) {
    console.log("✅ Tavily API key found");
  } else {
    console.log(
      "⚠️  Tavily API key not found - Tavily tools will not be available"
    );
  }

  console.log("✅ All configurations validated successfully");
}
