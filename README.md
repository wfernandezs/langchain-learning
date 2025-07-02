# LangChain Learning - TypeScript Project

A TypeScript-based project for learning and experimenting with LangChain.

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

## Next Steps

- Add more LangChain components and chains
- Implement your specific use cases
- Add testing with Jest or Vitest
- Set up linting with ESLint
- Configure Prettier for code formatting
