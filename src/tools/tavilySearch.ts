import { Tool } from "@langchain/core/tools";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

// Base Tavily search tool that can be composed by other tools
export class TavilySearchTool extends Tool {
  name = "tavily_search";
  description = "Search the web using Tavily search engine";

  private tavilyClient: TavilySearchResults;

  constructor() {
    super();

    // Check if Tavily API key is available
    if (!process.env.TAVILY_API_KEY) {
      throw new Error("TAVILY_API_KEY is required for TavilySearchTool");
    }

    this.tavilyClient = new TavilySearchResults({
      apiKey: process.env.TAVILY_API_KEY,
      maxResults: 5,
    });
  }

  async _call(input: string): Promise<any[]> {
    try {
      console.log(`🔍 Tavily search: ${input}`);
      const results = await this.tavilyClient.invoke(input);

      // Ensure we return an array
      if (Array.isArray(results)) {
        return results;
      } else if (typeof results === "string") {
        // If it's a string, try to parse it as JSON
        try {
          const parsed = JSON.parse(results);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          // If parsing fails, return empty array
          console.warn(
            "Tavily returned string that couldn't be parsed as JSON"
          );
          return [];
        }
      } else if (results && typeof results === "object") {
        // If it's an object, check if it has a results property
        if (Array.isArray(results.results)) {
          return results.results;
        } else if (Array.isArray(results.data)) {
          return results.data;
        } else {
          // Convert object to array if possible
          return Object.values(results);
        }
      }

      // Default fallback
      return [];
    } catch (error) {
      console.error("Error in Tavily search:", error);
      return [];
    }
  }

  // Getter for the Tavily client (for advanced usage)
  getTavilyClient(): TavilySearchResults {
    return this.tavilyClient;
  }
}

// Factory function for creating Tavily search tool
export function createTavilySearchTool(): TavilySearchTool {
  return new TavilySearchTool();
}

// Convenience function for direct search
export async function searchWithTavily(query: string): Promise<any[]> {
  const tool = new TavilySearchTool();
  return await tool._call(query);
}
