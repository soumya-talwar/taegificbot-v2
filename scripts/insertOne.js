import fs from "fs";
import { supabase } from "../src/supabaseClient.js";

const data = JSON.parse(fs.readFileSync("data/fics_with_embeddings.json"));

async function run() {
	const fic = data[0];
	const { error } = await supabase.from("fics").insert({
		title: fic.title,
		authors: fic.authors,
		ship: fic.ship.ship,
		warnings: fic.warnings,
		tags: fic.tags,
		word_count: fic.wordCount,
		length: fic.length,
		completed: fic.completed,
		language: fic.language,
		summary: fic.summary,
		url: fic.url,
		embedding: fic.embedding,
	});
	if (error) {
		console.error(error);
	} else {
		console.log("Inserted!");
	}
}

run();
