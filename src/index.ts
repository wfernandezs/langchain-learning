import { validateConfig, pinecone, ingestion } from "./config";
import { ingestTextFileToPinecone } from "./utils/ingestTextFileToPinecone";

async function main() {
  try {
    console.log("🚀 Starting LangChain TypeScript project...");
    validateConfig();

    if (ingestion.TO_PINECONE) {
      console.log("🔄 INGEST_TO_PINECONE is true. Running ingestion...");
      if (!ingestion.FILE_PATH) {
        throw new Error("INGEST_FILE_PATH is not defined.");
      }
      await ingestTextFileToPinecone({
        filePath: ingestion.FILE_PATH,
        chunkSize: ingestion.CHUNK_SIZE,
        chunkOverlap: ingestion.CHUNK_OVERLAP,
        pineconeIndex: pinecone.INDEX,
      });
    } else {
      console.log("⏭️ INGEST_TO_PINECONE is not true. Skipping ingestion.");
      const { answerWithRetrievalQA } = await import(
        "./utils/retrievalQAFromPinecone"
      );
      const question = "What is Pinecone in machine learning?";
      console.log(`\n🤖 Running retrieval QA for: ${question}`);
      const answer = await answerWithRetrievalQA({ query: question });
      console.log("\n📝 Answer:\n", answer);
    }
  } catch (error) {
    console.error("❌ Error starting application:", error);
    process.exit(1);
  }
}

main().catch(console.error);
