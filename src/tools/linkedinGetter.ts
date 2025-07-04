import { Tool } from "@langchain/core/tools";
import { TavilySearchTool } from "./tavilySearch";
import { config } from "../config";

// LinkedIn getter tool that composes the Tavily search tool
export class LinkedInGetterTool extends Tool {
  name = "linkedin_getter";
  description =
    "Get a LinkedIn profile URL for a given person's full name using web search";

  private searchTool: TavilySearchTool;

  constructor(searchTool?: TavilySearchTool) {
    super();
    // Use provided search tool or create a new one
    this.searchTool = searchTool || new TavilySearchTool();
  }

  async _call(input: string): Promise<string> {
    try {
      console.log(`🔍 Searching for LinkedIn profile: ${input}`);
      // Create a search query optimized for finding LinkedIn profiles
      const searchQuery = `${input} LinkedIn profile`;
      // Use the composed search tool
      const results = await this.searchTool._call(searchQuery);
      // Ensure results is an array
      let arr: any[] = [];
      if (Array.isArray(results)) {
        arr = results;
      } else if (results && typeof results === "object") {
        arr =
          (results as any).results ||
          (results as any).data ||
          Object.values(results);
      }
      // Select the LinkedIn URL from the result with the highest score
      const linkedinResults = arr.filter((result: any) => {
        const url = result.url?.toLowerCase() || "";
        return (
          url.includes("linkedin.com/in/") || url.includes("linkedin.com/pub/")
        );
      });
      if (linkedinResults.length > 0) {
        // Sort by score descending if available
        linkedinResults.sort(
          (a: any, b: any) => (b.score ?? 0) - (a.score ?? 0)
        );
        const best = linkedinResults[0];
        if (best.url) {
          // Remove any leading @ or whitespace
          return String(best.url).replace(/^[@\s]+/, "");
        }
      }
      return "No LinkedIn profile found";
    } catch (error) {
      console.error("Error getting LinkedIn URL:", error);
      return "Error searching for LinkedIn profile";
    }
  }
}

// Factory function for creating LinkedIn getter with default search tool
export function createLinkedInGetterTool(): LinkedInGetterTool {
  return new LinkedInGetterTool();
}

// Factory function for creating LinkedIn getter with custom search tool
export function createLinkedInGetterWithSearchTool(
  searchTool: TavilySearchTool
): LinkedInGetterTool {
  return new LinkedInGetterTool(searchTool);
}

// Also export a simple function version for convenience
export async function getLinkedInUrl(nameOfPerson: string): Promise<string> {
  const tool = new LinkedInGetterTool();
  return await tool._call(nameOfPerson);
}
