import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { OpenAIEmbeddings } from '@langchain/openai';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import { SupabaseError, NotFoundError } from '../utils/errors.js';
import type { DocumentMetadata, MeetingMetadata } from '../types/database.types.js';

class SupabaseService {
    private client: SupabaseClient;
    private vectorStore: SupabaseVectorStore | null = null;
    private embeddings: OpenAIEmbeddings;

    constructor() {
        this.client = createClient(
            config.supabase.url,
            config.supabase.serviceKey
        );

        this.embeddings = new OpenAIEmbeddings({
            openAIApiKey: config.openai.apiKey,
            modelName: config.embeddings.model,
        });

        logger.info('Supabase client initialized');
    }

    /**
     * Initialize vector store for similarity search
     */
    async initializeVectorStore(): Promise<SupabaseVectorStore> {
        if (this.vectorStore) {
            return this.vectorStore;
        }

        try {
            this.vectorStore = await SupabaseVectorStore.fromExistingIndex(
                this.embeddings,
                {
                    client: this.client,
                    tableName: 'document_embeddings',
                    queryName: 'match_documents',
                }
            );

            logger.info('Vector store initialized');
            return this.vectorStore;
        } catch (error) {
            logger.error('Failed to initialize vector store', error as Error);
            throw new SupabaseError('Failed to initialize vector store', error);
        }
    }

    /**
     * Get vector store instance
     */
    async getVectorStore(): Promise<SupabaseVectorStore> {
        if (!this.vectorStore) {
            return this.initializeVectorStore();
        }
        return this.vectorStore;
    }

    /**
     * Fetch complete document metadata by ID
     */
    async getDocumentMetadata(id: string): Promise<DocumentMetadata> {
        try {
            const { data, error } = await this.client
                .from('client_documents')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                throw error;
            }

            if (!data) {
                throw new NotFoundError(`Document with id ${id}`);
            }

            logger.debug('Fetched document metadata', { id, documentName: data.document_name });
            return data as DocumentMetadata;
        } catch (error) {
            logger.error('Failed to fetch document metadata', error as Error, { id });
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new SupabaseError(`Failed to fetch document metadata for id ${id}`, error);
        }
    }

    /**
     * Fetch complete meeting metadata by ID
     */
    async getMeetingMetadata(id: string): Promise<MeetingMetadata> {
        try {
            const { data, error } = await this.client
                .from('meeting_transcripts')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                throw error;
            }

            if (!data) {
                throw new NotFoundError(`Meeting with id ${id}`);
            }

            logger.debug('Fetched meeting metadata', { id, meetingTitle: data.meeting_title });
            return data as MeetingMetadata;
        } catch (error) {
            logger.error('Failed to fetch meeting metadata', error as Error, { id });
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new SupabaseError(`Failed to fetch meeting metadata for id ${id}`, error);
        }
    }

    /**
     * Search documents by query
     */
    async searchDocuments(query: string, limit: number = 10): Promise<DocumentMetadata[]> {
        try {
            const { data, error } = await this.client
                .from('client_documents')
                .select('*')
                .textSearch('document_name', query)
                .limit(limit);

            if (error) {
                throw error;
            }

            logger.debug('Searched documents', { query, resultCount: data?.length || 0 });
            return (data || []) as DocumentMetadata[];
        } catch (error) {
            logger.error('Failed to search documents', error as Error, { query });
            throw new SupabaseError('Failed to search documents', error);
        }
    }

    /**
     * Search meetings by query
     */
    async searchMeetings(query: string, limit: number = 10): Promise<MeetingMetadata[]> {
        try {
            const { data, error } = await this.client
                .from('meeting_transcripts')
                .select('*')
                .textSearch('meeting_title', query)
                .limit(limit);

            if (error) {
                throw error;
            }

            logger.debug('Searched meetings', { query, resultCount: data?.length || 0 });
            return (data || []) as MeetingMetadata[];
        } catch (error) {
            logger.error('Failed to search meetings', error as Error, { query });
            throw new SupabaseError('Failed to search meetings', error);
        }
    }

    /**
     * Get Supabase client for custom queries
     */
    getClient(): SupabaseClient {
        return this.client;
    }
}

// Export singleton instance
export const supabaseService = new SupabaseService();
