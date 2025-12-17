# AI Features Documentation

This document describes the AI-powered features added to the Business Directory application, including RAG (Retrieval-Augmented Generation) and semantic search capabilities.

## Overview

The AI features enable users to search for businesses using natural language queries in Mongolian. The system uses:

- **Embeddings** for semantic search
- **Vector similarity** for finding relevant businesses
- **LLM (Large Language Model)** for generating natural language responses
- **Redis caching** for performance optimization

## Architecture

### 1. Embedding System

#### Database Schema

Added `embedding` field to the `Business` model in Prisma:

```prisma
model Business {
  // ... existing fields
  embedding    Json?
  // ... rest of fields
}
```

#### Embedding Client (`apps/api/src/utils/embed-client.ts`)

Wrapper for AI embedding API that converts text to vector embeddings.

**Functions:**

- `embedText(text: string): Promise<number[]>` - Generate embedding for single text
- `embedTextBatch(texts: string[]): Promise<number[][]>` - Generate embeddings for multiple texts

#### Offline Embedding Script (`apps/api/src/helpers/embed-businesses.ts`)

Script to generate and store embeddings for all businesses.

**Embed all my bussinesses with script:**

```bash
npm run ai:embed
```

**What gets embedded:**

- Business name
- Description
- Summary
- Category name and description
- Parent category name
- Address information

### 2. Semantic Search System

#### AI Search Service (`apps/api/src/services/ai-search.service.ts`)

Core service implementing RAG pattern.

**Search Flow:**

1. Check Redis cache for existing answer
2. If cache miss:
   - Embed the user's question
   - Retrieve candidate businesses from database (filtered by city if provided)
   - Calculate cosine similarity between question and business embeddings
   - Select top N most relevant businesses
   - Build prompt with business data
   - Call LLM to generate natural language answer
   - Cache the result
3. Return answer and business matches

**Key Functions:**

- `search(question: string, city?: string, topN?: number): Promise<SearchResult>`
- `clearCache(question: string, city?: string): Promise<boolean>`
- `clearAllCache(): Promise<number>`

### 3. Redis Caching

#### Redis Client (`apps/api/src/utils/redis.ts`)

**Cache Key Design:**

```
ai:q:${MD5(question+city)}
```

**TTL:** 30 minutes (1800 seconds)

**CacheService Methods:**

- `get<T>(key: string): Promise<T | null>`
- `set(key: string, value: any, ttl?: number): Promise<boolean>`
- `delete(key: string): Promise<boolean>`
- `deletePattern(pattern: string): Promise<number>`
- `exists(key: string): Promise<boolean>`
- `ttl(key: string): Promise<number>`

### 4. API Endpoints

#### POST `/business/search`

Perform AI-powered semantic search.

**Request Body:**

```json
{
  "question": "Надад СБ дүүрэгт WI-FI-тэй кофе шоп олж өг",
  "city": "СБД",
  "topN": 5
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "answer": "AI-generated answer in Mongolian...",
    "businesses": [
      {
        "id": 1,
        "name": "Coffee Shop",
        "description": "...",
        "summary": "...",
        "category": "Restaurant",
        "district": "СБД",
        "score": 0.85
      }
    ],
    "cached": false
  },
  "message": "AI search completed successfully"
}
```

#### DELETE `/business/search/cache`

Clear AI search cache.

**Clear specific query:**

```json
{
  "question": "specific question",
  "city": "city name"
}
```

**Clear all cache:**

```json
{}
```

### 5. Frontend UI

#### Assistant Page (`apps/web/src/app/(main)/yellow-books/assistant/page.tsx`)

Main AI assistant interface.

**Features:**

- Natural language query input
- Optional city/district filter
- Example questions for quick start
- Real-time chat interface
- Business card display with relevance scores
- Loading states and error handling

**Components:**

- `ai-assistant.tsx` - Main chat interface
- `business-card.tsx` - Business result card with link to profile

**URL:** `/yellow-books/assistant`

## AI Prompt Design

```
Та Yellow Books-ийн туслах бөгөөд Улаанбаатар хотын бизнесүүдийн талаар мэдээлэл өгдөг.

Хэрэглэгчийн асуулт: "{{question}}"

Ашиглах боломжтой бизнесүүдийн мэдээлэл:
{{business_json}}

Дүрэм:
- Зөвхөн өгөгдсөн JSON мэдээлэл ашиглан хариулна уу
- Монгол хэлээр, найрсаг өнгө аясаар хариулна уу
- 3-5 бизнес санал болгоно уу (хамгийн тохиромжтой эхэлж)
- Бизнесийн нэр болон дүүргийг дурдана уу
- Хэрэв тохирох зүйл олдохгүй бол үнэнийг хэлнэ үү
- Товч бөгөөд ойлгомжтой байна уу
```

## Performance Considerations

1. **Embedding Generation:**

   - Batch processing with configurable size
   - Rate limiting with 100ms delay between requests
   - Error handling for individual failures

2. **Search Performance:**

   - Redis caching reduces API calls
   - 30-minute TTL balances freshness and performance
   - Candidate filtering (500 businesses max) before similarity calculation

3. **Cosine Similarity:**
   - Computed in Node.js (no external dependencies)
   - Efficient for small to medium datasets
   - Consider vector database (Pinecone, Weaviate) for larger scale

## Cost Optimization

1. **Caching:** Reduces API calls by 80-90% for repeated queries
2. **Batch Processing:** Efficient embedding generation
3. **Model Selection:** Use smaller models when appropriate
4. **Rate Limiting:** Prevents excessive API usage
5. **TTL Management:** Balance between freshness and cost

## Security Considerations

1. **API Key Protection:** Never commit API keys to version control
2. **Rate Limiting:** Implement on API endpoints to prevent abuse
3. **Input Validation:** Sanitize user queries
4. **Cache Poisoning:** Validate data before caching
5. **Access Control:** Consider authentication for admin endpoints
