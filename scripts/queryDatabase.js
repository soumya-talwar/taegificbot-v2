import { supabase } from "../src/supabaseClient.js";
import { GoogleGenAI } from "@google/genai";
import { rankFics } from "../src/ranker.js";
import "dotenv/config";

const ai = new GoogleGenAI({
	apiKey: process.env.GEMINI_API_KEY,
});

async function run() {
	const query = "taegi science fiction fic with angst";
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
	if (error) {
		console.error(error);
	} else {
		const ranked = rankFics(data, query);
		console.log("\nFinal Top Picks:");
		console.log(ranked.slice(0, 3));
	}
}

run();
