import { Tool } from "@langchain/core/tools";
import fetch from "node-fetch";

export interface LinkedInProfileData {
  firstName?: string;
  lastName?: string;
  headline?: string;
  summary?: string;
  location?: string;
  positions?: any[];
  schools?: any[];
  skills?: string[];
  [key: string]: any;
}

export class LinkedInScraperTool extends Tool {
  name = "linkedin_scraper";
  description = "Scrape information from LinkedIn profiles (basic HTML only)";

  constructor() {
    super();
  }

  async _call(linkedinProfileUrl: string): Promise<string> {
    try {
      console.log(`🔍 Scraping LinkedIn profile: ${linkedinProfileUrl}`);
      const data = await this.basicScraping(linkedinProfileUrl);
      const cleanedData = this.cleanData(data);
      return JSON.stringify(cleanedData, null, 2);
    } catch (error) {
      console.error("Error scraping LinkedIn profile:", error);
      return "Error scraping LinkedIn profile";
    }
  }

  private async basicScraping(
    linkedinProfileUrl: string
  ): Promise<LinkedInProfileData> {
    try {
      const response = await fetch(linkedinProfileUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
        timeout: 10000,
      });
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      const html = await response.text();
      return this.parseBasicHTML(html);
    } catch (error) {
      console.warn("Basic scraping failed, using fallback data");
      return this.getFallbackData(linkedinProfileUrl);
    }
  }

  private parseBasicHTML(html: string): LinkedInProfileData {
    const data: LinkedInProfileData = {
      firstName: "Unknown",
      lastName: "User",
      headline: "Professional",
      summary:
        "Profile information could not be scraped due to LinkedIn's protection.",
      location: "Unknown",
      positions: [],
      schools: [],
      skills: [],
    };
    const nameMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (nameMatch && typeof nameMatch[1] === "string") {
      const fullName = nameMatch[1].replace(/[|] LinkedIn/, "").trim();
      const nameParts = fullName.split(" ");
      if (
        nameParts.length >= 2 &&
        nameParts[0] &&
        nameParts.slice(1).join(" ")
      ) {
        data.firstName = nameParts[0] ?? "Unknown";
        data.lastName = nameParts.slice(1).join(" ") ?? "User";
      }
    }
    return data;
  }

  private getFallbackData(linkedinProfileUrl: string): LinkedInProfileData {
    return {
      firstName: "Profile",
      lastName: "User",
      headline: "LinkedIn Profile",
      summary: `LinkedIn profile found at: ${
        linkedinProfileUrl ?? ""
      }. Unable to scrape detailed information due to LinkedIn's protection measures.`,
      location: "Unknown",
      positions: [],
      schools: [],
      skills: [],
    };
  }

  private cleanData(data: LinkedInProfileData): LinkedInProfileData {
    const cleaned: LinkedInProfileData = {};
    for (const [key, value] of Object.entries(data)) {
      if (
        value !== null &&
        value !== undefined &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0) &&
        key !== "certifications"
      ) {
        cleaned[key] = value;
      }
    }
    return cleaned;
  }
}

export function createLinkedInScraperBasic(): LinkedInScraperTool {
  return new LinkedInScraperTool();
}

export async function scrapeLinkedInProfile(
  linkedinProfileUrl: string
): Promise<LinkedInProfileData> {
  const scraper = new LinkedInScraperTool();
  const result = await scraper._call(linkedinProfileUrl);
  try {
    return JSON.parse(result);
  } catch {
    return { error: result };
  }
}
