import { validateConfig } from "./config";
import { createLinkedInGetterWithSearchTool } from "./tools/linkedinGetter";
import { TavilySearchTool } from "./tools/tavilySearch";

async function iceBreakWith(name: string): Promise<string> {
  try {
    console.log(`🤝 Starting ice breaker for: ${name}`);

    // Use the existing agent to get LinkedIn URL
    const searchTool = new TavilySearchTool();
    const linkedinTool = createLinkedInGetterWithSearchTool(searchTool);
    const linkedinUrl = await linkedinTool._call(name);

    console.log(`🔗 LinkedIn URL found: ${linkedinUrl}`);

    return linkedinUrl;
  } catch (error) {
    console.error("❌ Error in ice breaker:", error);
    return "Error creating ice breaker summary";
  }
}

async function main() {
  try {
    console.log("🚀 Starting LangChain TypeScript project...");

    validateConfig();

    await iceBreakWith("Walter Fernandez Peru");
  } catch (error) {
    console.error("❌ Error starting application:", error);
    process.exit(1);
  }
}

main().catch(console.error);
