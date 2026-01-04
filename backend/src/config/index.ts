import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const configSchema = z.object({
    // Supabase
    supabase: z.object({
        url: z.string().url(),
        serviceKey: z.string().min(1),
        anonKey: z.string().min(1),
    }),

    // OpenAI
    openai: z.object({
        apiKey: z.string().min(1),
        model: z.string().default('gpt-4-turbo-preview'),
    }),

    // Embeddings
    embeddings: z.object({
        model: z.string().default('text-embedding-ada-002'),
        dimension: z.number().default(1536),
    }),

    // LangChain (optional)
    langchain: z.object({
        apiKey: z.string().optional(),
        tracing: z.boolean().default(false),
        project: z.string().default('ready-artwork-rag'),
    }),

    // Server
    server: z.object({
        port: z.number().default(3000),
        nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
        corsOrigin: z.string().default('http://localhost:8080'),
    }),

    // RAG Configuration
    rag: z.object({
        topKRetrieval: z.number().default(10),
        topKContext: z.number().default(5),
        llmTemperature: z.number().min(0).max(1).default(0.3),
        confidenceThresholdHigh: z.number().default(0.8),
        confidenceThresholdMedium: z.number().default(0.6),
    }),
});

export type Config = z.infer<typeof configSchema>;

function loadConfig(): Config {
    const rawConfig = {
        supabase: {
            url: process.env.SUPABASE_URL,
            serviceKey: process.env.SUPABASE_SERVICE_KEY,
            anonKey: process.env.SUPABASE_ANON_KEY,
        },
        openai: {
            apiKey: process.env.OPENAI_API_KEY,
            model: process.env.OPENAI_MODEL,
        },
        embeddings: {
            model: process.env.EMBEDDING_MODEL,
            dimension: process.env.EMBEDDING_DIMENSION ? parseInt(process.env.EMBEDDING_DIMENSION) : undefined,
        },
        langchain: {
            apiKey: process.env.LANGCHAIN_API_KEY,
            tracing: process.env.LANGCHAIN_TRACING_V2 === 'true',
            project: process.env.LANGCHAIN_PROJECT,
        },
        server: {
            port: process.env.PORT ? parseInt(process.env.PORT) : undefined,
            nodeEnv: process.env.NODE_ENV,
            corsOrigin: process.env.CORS_ORIGIN,
        },
        rag: {
            topKRetrieval: process.env.TOP_K_RETRIEVAL ? parseInt(process.env.TOP_K_RETRIEVAL) : undefined,
            topKContext: process.env.TOP_K_CONTEXT ? parseInt(process.env.TOP_K_CONTEXT) : undefined,
            llmTemperature: process.env.LLM_TEMPERATURE ? parseFloat(process.env.LLM_TEMPERATURE) : undefined,
            confidenceThresholdHigh: process.env.CONFIDENCE_THRESHOLD_HIGH ? parseFloat(process.env.CONFIDENCE_THRESHOLD_HIGH) : undefined,
            confidenceThresholdMedium: process.env.CONFIDENCE_THRESHOLD_MEDIUM ? parseFloat(process.env.CONFIDENCE_THRESHOLD_MEDIUM) : undefined,
        },
    };

    try {
        return configSchema.parse(rawConfig);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Configuration validation failed:');
            console.error(error.errors);
            throw new Error('Invalid configuration. Please check your environment variables.');
        }
        throw error;
    }
}

export const config = loadConfig();
