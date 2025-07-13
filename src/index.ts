import { validateConfig } from "./config";
import { createLinkedInGetterWithSearchTool } from "./tools/linkedinGetter";
import { TavilySearchTool } from "./tools/tavilySearch";
import { StructuredOutputParser } from "langchain/output_parsers";

async function iceBreakWith(name: string): Promise<string> {
  try {
    console.log(`🤝 Starting ice breaker for: ${name}`);

    // Use the existing agent to get LinkedIn URL
    const searchTool = new TavilySearchTool();
    const linkedinTool = createLinkedInGetterWithSearchTool(searchTool);
    const linkedinUrl = await linkedinTool._call(name);

    // Use StructuredOutputParser to format as JSON
    const parser = StructuredOutputParser.fromNamesAndDescriptions({
      name: "The person's name",
      linkedin: "The LinkedIn profile URL",
    });
    const jsonOutput = await parser.parse(
      `{ "name": "${name}", "linkedin": "${linkedinUrl}" }`
    );

    console.log("📝 JSON Output:", jsonOutput);

    return JSON.stringify(jsonOutput, null, 2);
  } catch (error) {
    console.error("❌ Error in ice breaker:", error);
    return "Error creating ice breaker summary";
  }
}

async function main() {
  try {
    console.log("🚀 Starting LangChain TypeScript project...");

    validateConfig();

    const json = await iceBreakWith("Walter Fernandez Peru");
    console.log("Final JSON result:\n", json);
  } catch (error) {
    console.error("❌ Error starting application:", error);
    process.exit(1);
  }
}

main().catch(console.error);
