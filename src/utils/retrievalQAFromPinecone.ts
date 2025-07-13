import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { pull } from "langchain/hub";
import { config, pinecone } from "../config";

// Main function to answer a query using Pinecone as retriever and OpenAI LLM
export async function answerWithRetrievalQA({
  query,
  pineconeIndex = pinecone.INDEX,
  openAIApiKey = config.openai.API_KEY,
  modelName = config.openai.MODEL,
  temperature = config.openai.TEMPERATURE,
}: {
  query: string;
  pineconeIndex?: string;
  openAIApiKey?: string;
  modelName?: string;
  temperature?: number;
}): Promise<string> {
  const embeddings = new OpenAIEmbeddings({ openAIApiKey });
  const llm = new ChatOpenAI({
    openAIApiKey,
    modelName,
    temperature,
  });

  // Set up Pinecone vector store
  const pineconeClient = new Pinecone({ apiKey: pinecone.API_KEY });
  const index = pineconeClient.index(pineconeIndex);
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
  });

  // Create retriever
  const retriever = vectorStore.asRetriever();

  // Pull the retrieval-qa-chat prompt from LangChain Hub
  const retrievalQaPrompt = await pull("langchain-ai/retrieval-qa-chat");

  // Retrieve relevant documents
  const docs = await retriever.getRelevantDocuments(query);
  const context = docs.map((doc) => doc.pageContent).join("\n\n");

  // Format the prompt (use .invoke, not .format)
  const promptValue = await retrievalQaPrompt.invoke({ input: query, context });

  // Get the answer from the LLM
  const result = await llm.invoke(promptValue);
  // If result is an object with content, return content; else, return as string
  return (result && (result.content || result.toString())) as string;
}
