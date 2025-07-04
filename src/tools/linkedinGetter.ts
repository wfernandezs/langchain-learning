import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { Tool } from "@langchain/core/tools";
import { TavilySearchTool } from "./tavilySearch";
import { config } from "../config";

// LinkedIn getter tool that composes the Tavily search tool
export class LinkedInGetterTool extends Tool {
  name = "linkedin_getter";
  description =
    "Get a LinkedIn profile URL for a given person's full name using web search";

  private model: ChatOpenAI;
  private promptTemplate: PromptTemplate;
  private searchTool: TavilySearchTool;

  constructor(searchTool?: TavilySearchTool) {
    super();

    this.model = new ChatOpenAI({
      modelName: config.openai.MODEL,
      temperature: config.openai.TEMPERATURE,
      openAIApiKey: config.openai.API_KEY,
    });

    this.promptTemplate = PromptTemplate.fromTemplate(
      "Given the search results for {name_of_person}, extract the most likely LinkedIn profile URL. If no LinkedIn profile is found, return 'No LinkedIn profile found'. Your answer should contain only the URL or the message 'No LinkedIn profile found'."
    );

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

      // Debug: Log what we received
      console.log("🔍 Search results type:", typeof results);
      console.log("🔍 Search results:", results);

      // Ensure results is an array
      if (!Array.isArray(results)) {
        console.warn("Search tool did not return an array, converting...");
        if (typeof results === "string") {
          return "No LinkedIn profile found";
        } else if (results && typeof results === "object") {
          const possibleArray =
            (results as any).results ||
            (results as any).data ||
            Object.values(results);
          if (Array.isArray(possibleArray)) {
            return await this.processSearchResults(possibleArray, input);
          }
        }
        return "No LinkedIn profile found";
      }

      // Select the LinkedIn URL from the result with the highest score
      const linkedinResults = results.filter((result: any) => {
        const url = result.url?.toLowerCase() || "";
        return url.includes("linkedin.com/in/");
      });
      if (linkedinResults.length > 0) {
        // Sort by score descending if available
        linkedinResults.sort(
          (a: any, b: any) => (b.score ?? 0) - (a.score ?? 0)
        );
        const best = linkedinResults[0];
        if (best.url) {
          return best.url;
        }
      }
      // Fallback to the old process if no scored result
      return await this.processSearchResults(results, input);
    } catch (error) {
      console.error("Error getting LinkedIn URL:", error);
      return "Error searching for LinkedIn profile";
    }
  }

  private async processSearchResults(
    results: any[],
    input: string
  ): Promise<string> {
    // Filter results to focus on LinkedIn profiles
    const linkedinResults = results.filter((result: any) => {
      const url = result.url?.toLowerCase() || "";
      const title = result.title?.toLowerCase() || "";
      const content = result.content?.toLowerCase() || "";

      return (
        url.includes("linkedin.com/in/") ||
        title.includes("linkedin") ||
        content.includes("linkedin")
      );
    });

    if (linkedinResults.length === 0) {
      return "No LinkedIn profile found";
    }

    // Use the LLM to extract the best LinkedIn URL from the search results
    const searchResultsText = linkedinResults
      .map((result: any, index: number) => {
        return `${index + 1}. ${result.title}\n   URL: ${
          result.url
        }\n   ${result.content?.substring(0, 200)}...`;
      })
      .join("\n\n");

    const promptValue = this.promptTemplate.format({
      name_of_person: input,
    });

    // Create a more detailed prompt with the search results
    const detailedPrompt = `${promptValue}\n\nSearch results:\n${searchResultsText}`;

    const response = await this.model.invoke(detailedPrompt);
    const result = response.content as string;

    // Clean up the result to ensure it's just a URL or the "not found" message
    const cleanResult = result.trim();

    if (cleanResult.toLowerCase().includes("no linkedin profile found")) {
      return "No LinkedIn profile found";
    }

    // Extract URL if present
    const urlMatch = cleanResult.match(/https?:\/\/[^\s]+/);
    if (urlMatch) {
      return urlMatch[0];
    }

    return cleanResult;
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
