import { createLinkedInGetterWithSearchTool } from "../tools/linkedinGetter";
import { TavilySearchTool } from "../tools/tavilySearch";

// Example usage function - testing createLinkedInGetterWithSearchTool
export async function demonstrateFlexibleAgents() {
  try {
    console.log(
      "🚀 Testing createLinkedInGetterWithSearchTool with Walter Fernandez Sanchez...\n"
    );

    // Create a Tavily search tool instance
    const searchTool = new TavilySearchTool();

    // Create LinkedIn getter with the search tool
    const linkedinTool = createLinkedInGetterWithSearchTool(searchTool);

    // Test with Walter Fernandez Sanchez
    const result = await linkedinTool._call("Walter Fernandez Sanchez");

    console.log("🔍 Search Tool Used:", searchTool.name);
    console.log("🔗 LinkedIn Tool Used:", linkedinTool.name);
    console.log("👤 Person Searched: Walter Fernandez Sanchez");
    console.log("📋 Result:", result);
  } catch (error) {
    console.error(
      "❌ Error testing createLinkedInGetterWithSearchTool:",
      error
    );
    throw error;
  }
}
