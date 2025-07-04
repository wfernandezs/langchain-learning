import { config, validateConfig } from "./config";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { createLinkedInGetterWithSearchTool } from "./tools/linkedinGetter";
import { TavilySearchTool } from "./tools/tavilySearch";
import { createLinkedInScraperBasic } from "./tools/linkedinScraper";

async function iceBreakWith(name: string): Promise<string> {
  try {
    console.log(`🤝 Starting ice breaker for: ${name}`);

    // Use the existing agent to get LinkedIn URL
    const searchTool = new TavilySearchTool();
    const linkedinTool = createLinkedInGetterWithSearchTool(searchTool);
    const linkedinUrl = await linkedinTool._call(name);

    console.log(`🔗 LinkedIn URL found: ${linkedinUrl}`);

    // Use the basic LinkedIn scraper
    const scraper = createLinkedInScraperBasic();
    const linkedinDataObj = await scraper._call(linkedinUrl);

    // Use the scraped data as the information
    const linkedinData = linkedinDataObj;

    // Create summary template
    const summaryTemplate = `
    Given the LinkedIn information {information} about a person I want you to create:
    1. A short summary
    2. Two interesting facts about them
    `;

    const summaryPromptTemplate = PromptTemplate.fromTemplate(summaryTemplate);

    // Create LLM
    const llm = new ChatOpenAI({
      temperature: 0,
      modelName: "gpt-3.5-turbo",
      openAIApiKey: config.openai.API_KEY,
    });

    // Create chain
    const chain = summaryPromptTemplate.pipe(llm);

    // Invoke the chain
    const result = await chain.invoke({
      information: linkedinData,
    });

    console.log("📋 Ice Breaker Result:");
    console.log(result.content);

    return result.content as string;
  } catch (error) {
    console.error("❌ Error in ice breaker:", error);
    return "Error creating ice breaker summary";
  }
}

async function main() {
  try {
    console.log("🚀 Starting LangChain TypeScript project...");

    validateConfig();

    // Test ice breaker with Walter Fernandez Sanchez
    await iceBreakWith("Walter Fernandez Sanchez");
  } catch (error) {
    console.error("❌ Error starting application:", error);
    process.exit(1);
  }
}

main().catch(console.error);
