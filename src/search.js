import { supabase } from "./database.js";
import { GoogleGenAI } from "@google/genai";
import { rankFics } from "./ranker.js";
import "dotenv/config";

const ai = new GoogleGenAI({
	apiKey: process.env.GEMINI_API_KEY,
});

export async function searchFics(query) {
	if (!query) throw new Error("Query is required");
	const res = await ai.models.embedContent({
		model: "gemini-embedding-001",
		contents: [query],
	});
	const embedding = res.embeddings[0].values;
	const { data, error } = await supabase.rpc("match_fics", {
		query_embedding: embedding,
		match_threshold: 0.5,
		match_count: 20,
	});
	if (error) throw new Error(error.message);
	const ranked = rankFics(data, query);
	return ranked.slice(0, 3);
}
