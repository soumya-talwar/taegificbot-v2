import fs from "fs";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const DATA_FILE = "data/fics_with_embeddings.json";

const ai = new GoogleGenAI({
	apiKey: process.env.GEMINI_API_KEY,
});

function cosineSimilarity(a, b) {
	let dot = 0;
	let normA = 0;
	let normB = 0;
	for (let i = 0; i < a.length; i++) {
		dot += a[i] * b[i];
		normA += a[i] * a[i];
		normB += b[i] * b[i];
	}
	return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function filterByQueryIntent(fics, query) {
	const q = query.toLowerCase();
	return fics.filter((fic) => {
		return (
			fic.tags.some((tag) => q.includes(tag)) ||
			q.includes(fic.ship) ||
			q.includes(fic.length)
		);
	});
}

async function run() {
	const query = process.argv.slice(2).join(" ");
	if (!query) {
		console.log("Please provide a query");
		console.log(`Example: node scripts/query.js "angsty slow burn taegi"`);
		return;
	}
	console.log(`\nQuery: "${query}"`);
	const fics = JSON.parse(fs.readFileSync(DATA_FILE));
	const result = await ai.models.embedContent({
		model: "gemini-embedding-001",
		contents: [query],
	});
	const queryEmbedding = result.embeddings[0].values;
	const scored = fics.map((fic) => ({
		...fic,
		score: cosineSimilarity(queryEmbedding, fic.embedding),
	}));
	scored.sort((a, b) => b.score - a.score);
	const top20 = scored.slice(0, 20);
	const filtered = filterByQueryIntent(top20, query);
	const finalResults = (filtered.length > 0 ? filtered : top20).slice(0, 3);
	console.log("\nResults:\n");
	finalResults.forEach((fic, i) => {
		console.log(`${i + 1}. ${fic.title}`);
		console.log(`   Score: ${fic.score.toFixed(4)}`);
		console.log(`   Tags: ${fic.tags.slice(0, 5).join(", ")}`);
		console.log(`   Length: ${fic.length}`);
		console.log(`   Completed: ${fic.completed}`);
		console.log(`   URL: ${fic.url}\n`);
	});
}

run();
