import { ChatOpenAI } from "@langchain/openai";
import { pull } from "langchain/hub";
import { AgentExecutor, createReactAgent } from "langchain/agents";
import { Tool } from "@langchain/core/tools";
import { config } from "../config";

export async function createReactAgentWithTools(tools: Tool[]) {
  try {
    console.log("🔧 Creating React Agent with custom tools...");

    // Initialize the model
    const model = new ChatOpenAI({
      modelName: config.openai.MODEL,
      temperature: config.openai.TEMPERATURE,
      openAIApiKey: config.openai.API_KEY,
    });

    // Pull the react agent from LangChain Hub
    const prompt = await pull("hwchase17/react");
    console.log("✅ Successfully pulled hwchase17/react from LangChain Hub");

    // Create the React agent with provided tools
    const agent = await createReactAgent({
      llm: model,
      tools,
      prompt: prompt as any, // Type assertion to handle the prompt type
    });

    // Create the agent executor
    const agentExecutor = new AgentExecutor({
      agent,
      tools,
      verbose: true,
    });

    console.log(
      `✅ React Agent created successfully with ${tools.length} tool(s)`
    );
    return agentExecutor;
  } catch (error) {
    console.error("❌ Error creating React Agent:", error);
    throw error;
  }
}

export async function runAgentExample() {
  try {
    const { LinkedInGetterTool } = await import("../tools/linkedinGetter");

    // Create tools array
    const tools = [new LinkedInGetterTool()];

    const agentExecutor = await createReactAgentWithTools(tools);

    const result = await agentExecutor.invoke({
      input: "Get me the LinkedIn profile URL for John Doe",
    });

    console.log("🤖 Agent Response:", result.output);
    return result;
  } catch (error) {
    console.error("❌ Error running agent example:", error);
    throw error;
  }
}
