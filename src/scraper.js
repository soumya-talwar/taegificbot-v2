import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeFic(url) {
	try {
		const { data } = await axios.get(url + "?view_adult=true", {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
				"Accept-Language": "en-US,en;q=0.9",
				Accept:
					"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
				Connection: "keep-alive",
			},
		});
		const $ = cheerio.load(data);
		const title = $("h2.title").text().trim() || $("h2.heading").text().trim();
		const authors = [];
		$("a[rel='author']").each((_, el) => {
			authors.push($(el).text().trim());
		});
		const pairings = [];
		$("dd.relationships a, dd.relationship a").each((_, el) => {
			pairings.push($(el).text().trim());
		});
		const warnings = [];
		$("dd.archive_warnings a, dd.warning a").each((_, el) => {
			warnings.push($(el).text().trim());
		});
		const categories = [];
		$("dd.category a").each((_, el) => {
			categories.push($(el).text().trim());
		});
		const tags = [];
		$("dd.freeform a").each((_, el) => {
			tags.push($(el).text().trim());
		});
		const language = $("dd.language").text().trim();
		const wordsText = $("dd.words").text().trim();
		const words = parseInt(wordsText.replace(/,/g, "")) || 0;
		const chaptersText = $("dd.chapters").text().trim();
		let current = 0;
		let total = 0;
		let completed = false;
		if (chaptersText.includes("/")) {
			const [curr, tot] = chaptersText.split("/");
			current = parseInt(curr);
			total = tot === "?" ? null : parseInt(tot);
			completed = current === total;
		}
		return {
			title,
			authors,
			pairings,
			warnings,
			categories,
			tags,
			language,
			words,
			chapters: {
				current,
				total,
			},
			completed,
			url,
		};
	} catch (err) {
		console.error("Scrape failed:", err.message);
		return null;
	}
}
