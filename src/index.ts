import { ChatOpenAI } from "@langchain/openai";
import { config, validateConfig } from "./config";
import { PromptTemplate } from "@langchain/core/prompts";

async function main() {
  try {
    console.log("🚀 Starting LangChain TypeScript project...");

    validateConfig();

    const { openai } = config;
    const model = new ChatOpenAI({
      modelName: openai.MODEL,
      temperature: openai.TEMPERATURE,
      openAIApiKey: openai.API_KEY,
    });

    const summaryTemplate = `
      given the information {information} about a person I want you to create:
      1. a short summary
      2. two interesting facts about the person
      return a summary of the information
    `;

    const summaryPromptTemplate = PromptTemplate.fromTemplate(summaryTemplate);

    const promptValue = await summaryPromptTemplate.format({
      information: `Arnold Alois Schwarzenegger[b] (born July 30, 1947) is an Austrian and American actor, businessman, 
       former politician, and former professional bodybuilder, known for his roles in high-profile action films.
       He served as the 38th governor of California from 2003 to 2011.[3]
       Schwarzenegger began lifting weights at age 15 and won the Mr. Universe title aged 20, 
       and subsequently the Mr. Olympia title seven times`,
    });

    const response = await model.invoke(promptValue);
    console.log(response.content);
  } catch (error) {
    console.error("❌ Error starting application:", error);
    process.exit(1);
  }
}

main().catch(console.error);
