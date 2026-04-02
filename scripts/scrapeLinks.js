import fs from "fs";
import { scrapeFic } from "../src/scraper.js";

const links = fs
	.readFileSync("data/links.csv")
	.toString()
	.split("\n")
	.map((line) => line.split(",")[0].trim())
	.filter(Boolean);

const OUTPUT_FILE = "data/fics.json";

let results = [];
if (fs.existsSync(OUTPUT_FILE)) {
	results = JSON.parse(fs.readFileSync(OUTPUT_FILE));
}

async function delay(ms) {
	return new Promise((res) => setTimeout(res, ms));
}

(async () => {
	for (let i = 0; i < links.length; i++) {
		const url = links[i];
		if (results.find((f) => f.url === url)) {
			console.log(`Already scraped: ${i + 1}/${links.length}`);
			continue;
		}
		console.log(`Scraping ${i + 1}/${links.length}`);
		const fic = await scrapeFic(url);
		if (fic) {
			results.push(fic);
			fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
		} else console.log("Failed:", url);
		await delay(2000);
	}
	console.log("Done scraping all fics");
})();
