import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { TextLoader } from "langchain/document_loaders/fs/text";

export interface IngestOptions {
  filePath: string;
  chunkSize?: number;
  chunkOverlap?: number;
  pineconeIndex: string;
}

export async function ingestTextFileToPinecone({
  filePath,
  chunkSize = 1000,
  chunkOverlap = 0,
  pineconeIndex,
}: IngestOptions): Promise<void> {
  const pineconeApiKey = process.env.PINECONE_API_KEY;
  if (!pineconeApiKey) {
    throw new Error("PINECONE_API_KEY is not set in environment variables.");
  }

  console.log(`📄 Loading file: ${filePath}`);
  const loader = new TextLoader(filePath);
  const loadedDocs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
  });
  const splitDocs = await splitter.splitDocuments(loadedDocs);
  console.log(`✂️ Split into ${splitDocs.length} chunks.`);

  const embeddings = new OpenAIEmbeddings();

  const pinecone = new Pinecone({ apiKey: pineconeApiKey });
  const index = pinecone.index(pineconeIndex);

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
  });

  try {
    console.log("🌲 Storing documents in Pinecone...");
    await vectorStore.addDocuments(splitDocs);
    console.log("✅ Successfully stored documents in Pinecone.");
  } catch (error) {
    console.error("❌ Error storing documents in Pinecone:", error);
    throw error;
  }
}
