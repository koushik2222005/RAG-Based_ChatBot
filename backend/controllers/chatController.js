import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { OllamaEmbeddings, Ollama } from "@langchain/ollama";

export const handleChat = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Context string payload structural configuration invalid." });
  }

  try {
    const embeddings = new OllamaEmbeddings({
      baseUrl: process.env.OLLAMA_BASE_URL,
      model: process.env.EMBEDDING_MODEL,
    });

    // 1. Initialize file matrix bindings
    const vectorStore = await FaissStore.load("./vector_store", embeddings);

    // 2. Query against documents using exact vector space coordinates (saves token size parameters)
    const similarityResults = await vectorStore.similaritySearch(message, 3);
    const contextText = similarityResults.map(doc => doc.pageContent).join("\n\n");

    // 3. Route structural queries internally to your active running engine
    const ollama = new Ollama({
      baseUrl: process.env.OLLAMA_BASE_URL,
      model: process.env.LLM_MODEL,
    });

    const runtimePrompt = `You are an AI assistant processing requests against document sources. Use the explicit data insights provided below to compose answers. If answers cannot be determined, specify that directly. Keep responses direct.

Document Source Context:
${contextText}

Question Parameters: ${message}
Direct Output Answer:`;

    // 4. Provision appropriate dynamic delivery interfaces for connection streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    const streamingPipeline = await ollama.stream(runtimePrompt);
    
    for await (const analyticalToken of streamingPipeline) {
      res.write(analyticalToken);
    }
    
    res.end();

  } catch (error) {
    console.error("Model mapping execution fault:", error);
    res.status(500).json({ error: "A local analytical evaluation fault interrupted prompt processing." });
  }
};