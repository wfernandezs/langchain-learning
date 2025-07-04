import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { validateRequiredEnv } from "../utils/env";
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

export function validateConfig(): void {
  validateRequiredEnv(["OPENAI_API_KEY"]);
  validateOpenAIConfig();

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
