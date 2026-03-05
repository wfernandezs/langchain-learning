# LangChain Learning - TypeScript Project

A TypeScript-based project for learning and experimenting with LangChain, featuring multiple branches exploring different LangChain capabilities including AI agents, vector databases, and RAG implementations.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Setup

1. Install dependencies:

```bash
npm install
```

2. Set up your environment variables:

```bash
# Copy the example environment file
cp env.example .env

# Edit the .env file with your actual values
# Make sure to set your OPENAI_API_KEY
```

## Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Run the compiled JavaScript
- `npm run dev` - Run TypeScript directly with ts-node (for development)
- `npm run watch` - Watch for changes and recompile automatically
- `npm run clean` - Remove the dist folder

## Project Structure

```
langchain-learning/
├── src/           # TypeScript source files
│   ├── index.ts   # Main entry point
│   ├── config/    # Configuration modules
│   │   ├── index.ts      # Main configuration export
│   │   ├── environment.ts # Environment-specific config
│   │   └── openai.ts     # OpenAI-specific config
│   └── utils/     # Utility functions
│       └── env.ts # Environment variable utilities
├── dist/          # Compiled JavaScript (generated)
├── tsconfig.json  # TypeScript configuration
├── package.json   # Project dependencies and scripts
├── env.example    # Environment variables template
└── README.md      # This file
```

## Environment Variables

The project uses environment variables for configuration. Copy the example file and customize it:

```bash
cp env.example .env
```

### Required Variables

- `OPENAI_API_KEY` - Your OpenAI API key (required)

### Optional Variables

- `NODE_ENV` - Environment mode (development/production, default: development)
- `OPENAI_MODEL` - OpenAI model to use (default: gpt-3.5-turbo)
- `OPENAI_TEMPERATURE` - Model temperature (default: 0.7)
- `OPENAI_MAX_TOKENS` - Maximum tokens for responses (default: 4096)
- `OPENAI_TIMEOUT` - Request timeout in milliseconds (default: 60000)
- `PORT` - Server port (default: 3000)
- `LOG_LEVEL` - Logging level (default: info)

## Getting Started

1. Start the development server:

```bash
npm run dev
```

2. Or build and run:

```bash
npm run build
npm start
```

## Features

- ✅ TypeScript configuration with strict mode
- ✅ Source maps for debugging
- ✅ Hot reloading with ts-node
- ✅ LangChain integration ready
- ✅ Modern ES2022 target
- ✅ Proper type definitions
- ✅ Environment variable management with dotenv
- ✅ Type-safe configuration validation

## Repository Branches

This repository contains multiple branches, each exploring different LangChain features and use cases:

### Main Branch (`main`)
The base branch with the foundational TypeScript setup for LangChain development.

**Contents:**
- Basic TypeScript project structure
- LangChain core dependencies
- Environment configuration utilities
- OpenAI integration setup

### LinkedIn Scraper Branch (`linkedin-scrapper`)
Explores LangChain agents and tools for web scraping and search functionality.

**Key Features:**
- ReAct agent implementation ([src/agents/reactAgent.ts](src/agents/reactAgent.ts))
- Agent examples and patterns ([src/agents/agentExamples.ts](src/agents/agentExamples.ts))
- LinkedIn profile retrieval tool ([src/tools/linkedinGetter.ts](src/tools/linkedinGetter.ts))
- Tavily search integration ([src/tools/tavilySearch.ts](src/tools/tavilySearch.ts))
- Output parsers for structured responses

**Additional Files:**
- `src/agents/` - Agent implementations
- `src/tools/` - Custom tools for agents

### Vector DB Learning Branch (`vector-db-learning`)
Focuses on vector databases and Retrieval-Augmented Generation (RAG) patterns using Pinecone.

**Key Features:**
- Pinecone vector database integration
- RAG implementation with context retrieval
- Text ingestion utilities ([src/utils/ingestTextFileToPinecone.ts](src/utils/ingestTextFileToPinecone.ts))
- Retrieval QA from Pinecone ([src/utils/retrievalQAFromPinecone.ts](src/utils/retrievalQAFromPinecone.ts))
- Enhanced configuration for vector DB settings

**Additional Files:**
- `src/utils/ingestTextFileToPinecone.ts` - Utilities for ingesting documents into Pinecone
- `src/utils/retrievalQAFromPinecone.ts` - QA retrieval from vector database

**Additional Environment Variables:**
- Pinecone API configuration
- Vector DB specific settings

## Exploring Different Branches

To switch between branches and explore different implementations:

```bash
# Switch to the LinkedIn scraper implementation
git checkout linkedin-scrapper

# Switch to the vector DB/RAG implementation
git checkout vector-db-learning

# Return to the main branch
git checkout main
```

## Learning Path

For a structured learning experience, consider exploring the branches in this order:

1. **Start with `main`** - Understand the base setup and configuration
2. **Move to `linkedin-scrapper`** - Learn about LangChain agents, tools, and structured output
3. **Explore `vector-db-learning`** - Dive into vector databases and RAG patterns

## Next Steps

- Add more LangChain components and chains
- Experiment with different agent types and tools
- Implement custom vector stores and embeddings
- Add testing with Jest or Vitest
- Set up linting with ESLint
- Configure Prettier for code formatting
