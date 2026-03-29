import { supabase } from "../src/supabaseClient.js";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
	apiKey: process.env.GEMINI_API_KEY,
});

async function run() {
	const query = "angsty slow burn taegi long fic";
	const res = await ai.models.embedContent({
		model: "gemini-embedding-001",
		contents: [query],
	});
	const embedding = res.embeddings[0].values;
	const { data, error } = await supabase.rpc("match_fics", {
		query_embedding: embedding,
		match_threshold: 0.5,
		match_count: 5,
	});
	if (error) {
		console.error(error);
	} else {
		console.log("\nTop Matches:");
		console.log(data);
	}
}

run();
