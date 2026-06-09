# Local RAG AI Workspace

An air-gapped Retrieval-Augmented Generation (RAG) chatbot engine built to parse PDFs, build high-density local vector file stores, and pipe precise contextualized semantic prompt responses via offline large language models.

## Prerequisites

1. Install **Ollama** onto your machine.
2. Initialize and download required asset dependencies using explicit system commands:
```bash
   ollama pull llama3
   ollama pull nomic-embed-text