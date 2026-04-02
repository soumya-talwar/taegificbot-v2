# Taegificbot v2.0 — BTS Fanfiction Recommendation API

A semantic search API for discovering BTS (taegi) fanfiction using embeddings, vector similarity, and custom ranking.

Originally built as a Twitter bot in 2020, this project has been re-engineered into a modern API that surfaces high-quality recommendations based on natural language queries.
<br><br>

## 🚀 Live API

Base URL:

```
https://taegificbot.vercel.app/api/recommend
```

Example:

```
GET /api/recommend?query=angsty slow burn taegi
```

<br>

## ✨ Features

* 🔍 Semantic search using embeddings (Gemini)
* 🧠 Hybrid ranking (vector similarity + tag + metadata matching)
* 🗂 Structured fic metadata (tags, length, completion, warnings)
* ⚡ Fast vector search using Supabase (pgvector)
* 🌐 Public API — usable via browser, Postman, or code

<br>

## 🧱 Tech Stack

* Node.js
* Supabase (PostgreSQL + pgvector)
* Google Gemini Embeddings API
* Puppeteer + Cheerio (scraping)
* Vercel (deployment)

<br>

## 📦 API Usage

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

<br>

## 🧪 Try It Yourself

You can test the API using:

* Browser
* Postman / Insomnia
* curl:

```
curl "https://taegificbot.vercel.app/api/recommend?query=angsty slow burn taegi"
```
