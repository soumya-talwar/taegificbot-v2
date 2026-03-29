import fs from "fs";
import { supabase } from "../src/supabaseClient.js";

const data = JSON.parse(fs.readFileSync("data/fics_with_embeddings.json"));

async function run() {
	for (let i = 0; i < data.length; i++) {
		const fic = data[i];
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
			console.log(`Inserted fic ${i + 1} of ${data.length}`);
		}
	}
}

run();
