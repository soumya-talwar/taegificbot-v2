import fs from "fs";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const INPUT_FILE = "data/fics_clean.json";
const OUTPUT_FILE = "data/fics_with_embeddings.json";
const BATCH_SIZE = 20;
const DELAY_BETWEEN_BATCHES = 2000;

const ai = new GoogleGenAI({
	apiKey: process.env.GEMINI_API_KEY,
});

function delay(ms) {
	return new Promise((res) => setTimeout(res, ms));
}

function loadExisting() {
	if (!fs.existsSync(OUTPUT_FILE)) return [];
	return JSON.parse(fs.readFileSync(OUTPUT_FILE));
}

function saveProgress(data) {
	fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
}

function chunkArray(array, size) {
	const chunks = [];
	for (let i = 0; i < array.length; i += size) {
		chunks.push(array.slice(i, i + size));
	}
	return chunks;
}

async function run() {
	const raw = JSON.parse(fs.readFileSync(INPUT_FILE));
	let existing = loadExisting();
	const existingMap = new Map();
	for (const fic of existing) {
		existingMap.set(fic.url, fic);
	}
	const pending = raw.filter((fic) => !existingMap.has(fic.url));
	console.log(`Total fics: ${raw.length}`);
	console.log(`Already embedded: ${existing.length}`);
	console.log(`Pending: ${pending.length}`);
	const batches = chunkArray(pending, BATCH_SIZE);
	for (let i = 0; i < batches.length; i++) {
		const batch = batches[i];
		console.log(`\nProcessing batch ${i + 1}/${batches.length}`);
		try {
			const texts = batch.map((fic) => fic.searchText);
			const result = await ai.models.embedContent({
				model: "gemini-embedding-001",
				contents: texts,
			});
			const embeddings = result.embeddings;
			if (!embeddings || embeddings.length !== batch.length) {
				throw new Error(
					`Embedding mismatch: expected ${batch.length}, got ${embeddings?.length}`,
				);
			}
			for (let j = 0; j < batch.length; j++) {
				batch[j].embedding = embeddings[j].values;
				existing.push(batch[j]);
			}
			saveProgress(existing);
			console.log(`Saved batch ${i + 1}`);
			await delay(DELAY_BETWEEN_BATCHES);
		} catch (err) {
			console.error(`Batch failed: ${err.message}`);
			console.log("Retrying individually...");
			for (const fic of batch) {
				try {
					const res = await ai.models.embedContent({
						model: "gemini-embedding-001",
						contents: [fic.searchText],
					});
					fic.embedding = res.embeddings[0].values;
					existing.push(fic);
					saveProgress(existing);
					console.log(`Saved: ${fic.title}`);
					await delay(1000);
				} catch (err2) {
					console.error(`Failed permanently: ${fic.title}`);
				}
			}
		}
	}
	console.log("\nEmbedding complete!");
}

run();
