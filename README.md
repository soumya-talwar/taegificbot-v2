# TAEGIFICBOT v2.0

### BTS Taegi Fanfiction Recommendation API

A semantic search API for discovering BTS (taegi) fanfiction using embeddings, vector similarity, and custom ranking.

Originally built as a Twitter bot in 2020, this project has been re-engineered into an API that surfaces recommendations based on natural language queries.

## Live API

Base URL:

```
https://taegificbot.vercel.app/api/recommend
```

Example:

```
GET /api/recommend?query=angsty slow burn taegi
```

## Features

- Semantic search using embeddings (Gemini)
- Hybrid ranking (vector similarity + tag + metadata matching)
- Structured fic metadata (tags, length, completion, warnings)
- Fast vector search using Supabase (pgvector)
- Public API — usable via browser, Postman, or code

## API usage

### Request

```
GET /api/recommend?query=slow burn enemies to lovers taegi
```

### Response

```json
[
  {
    "title": "...",
    "authors": [...],
    "ship": "...",
    "tags": [...],
    "warnings": [...],
    "length": "...",
    "word_count": integer (number of words)
    "completed": boolean,
    "summary": "...",
    "url": "...",
    "similarity": float (0–1, vector similarity score),
    "finalScore": float (0–1+, hybrid ranking score)
  }
]
```

## Built with

- **Node.js**
- **Google Gemini Embeddings API**
- **Supabase (PostgreSQL + pgvector)**
- **Puppeteer + Cheerio**
- **Vercel**
