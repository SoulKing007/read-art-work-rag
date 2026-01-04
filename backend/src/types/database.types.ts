// Database table types
export interface DocumentMetadata {
    id: string;
    document_name: string;
    file_url: string;
    upload_date: string;
    uploaded_by?: string;
    category?: string;
    client_id?: string;
    file_size?: number;
    file_type?: string;
    page_count?: number;
    created_at?: string;
    updated_at?: string;
}

export interface MeetingMetadata {
    id: string;
    meeting_title: string;
    transcript_url?: string;
    meeting_date: string;
    participants?: string[];
    meeting_type?: string;
    client_id?: string;
    duration_minutes?: number;
    recording_url?: string;
    summary?: string;
    created_at?: string;
    updated_at?: string;
}

export interface EmbeddingMetadata {
    source_id: string;
    source_type: 'document' | 'meeting';
    chunk_index?: number;
    page_number?: number;
    timestamp?: string;
    [key: string]: unknown;
}

// Vector search result
export interface ChunkWithMetadata {
    content: string;
    metadata: EmbeddingMetadata;
    similarityScore: number;
}

// Enriched chunk with full metadata
export interface EnrichedChunk {
    content: string;
    excerpt: string;
    similarityScore: number;
    sourceType: 'document' | 'meeting';
    sourceMetadata: DocumentMetadata | MeetingMetadata;
    embeddingMetadata: EmbeddingMetadata;
}

// Query analysis result
export interface QueryAnalysis {
    queryType: 'factual' | 'timeline' | 'decision' | 'technical';
    keywords: string[];
    timeframe?: {
        start: Date;
        end: Date;
    };
    specificDocument?: string;
    specificMeeting?: string;
}

// Source in response
export interface Source {
    type: 'document' | 'meeting';
    name: string;
    date: string;
    url: string;
    excerpt: string;
    metadata: {
        uploadedBy?: string;
        participants?: string[];
        category?: string;
        pageNumber?: number;
        timestamp?: string;
        [key: string]: unknown;
    };
    relevanceScore: number;
}

// Final response
export interface ChatResponse {
    answer: string;
    sources: Source[];
    confidence: 'high' | 'medium' | 'low';
    conversationId?: string;
}

// Agent state for LangGraph
export interface AgentState {
    query: string;
    queryAnalysis?: QueryAnalysis;
    retrievedChunks?: ChunkWithMetadata[];
    enrichedChunks?: EnrichedChunk[];
    rankedContext?: EnrichedChunk[];
    generatedAnswer?: string;
    formattedResponse?: ChatResponse;
    error?: string;
}

// API request types
export interface ChatQueryRequest {
    query: string;
    conversationId?: string;
    filters?: {
        dateRange?: {
            start: string;
            end: string;
        };
        documentTypes?: string[];
        meetingTypes?: string[];
    };
}

export interface SearchRequest {
    q: string;
    type?: 'document' | 'meeting';
    limit?: number;
}
