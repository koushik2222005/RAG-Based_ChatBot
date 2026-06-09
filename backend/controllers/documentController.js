import fs from 'fs';
import pdfParse from 'pdf-parse';
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { OllamaEmbeddings } from "@langchain/ollama";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Missing physical file content stream." });
    }

    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    
    // 1. Convert PDF buffer stream to clean string lines
    const pdfData = await pdfParse(dataBuffer);
    
    // 2. Fragment raw output safely into compact text chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 150,
    });
    const docs = await textSplitter.createDocuments([pdfData.text]);

    // 3. Bind to the local Ollama embedding instances
    const embeddings = new OllamaEmbeddings({
      baseUrl: process.env.OLLAMA_BASE_URL,
      model: process.env.EMBEDDING_MODEL,
    });

    const vectorStorePath = "./vector_store";
    let vectorStore;

    // 4. Update index files locally or initialize from scratch
    if (fs.existsSync(`${vectorStorePath}/faiss.index`)) {
      vectorStore = await FaissStore.load(vectorStorePath, embeddings);
      await vectorStore.addDocuments(docs);
    } else {
      vectorStore = await FaissStore.fromDocuments(docs, embeddings);
    }
    
    await vectorStore.save(vectorStorePath);

    // Housekeeping: drop staging file reference safely
    fs.unlinkSync(filePath);

    res.status(200).json({ message: "Documents ingested and vectorized locally." });
  } catch (error) {
    console.error("Ingestion subsystem error:", error);
    res.status(500).json({ error: "Pipeline processing failure occurred handling document upload." });
  }
};