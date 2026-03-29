import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

let browser;

async function getBrowser() {
	if (!browser) {
		browser = await puppeteer.launch({
			headless: true,
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
		});
	}
	return browser;
}

export async function scrapeFic(url) {
	const finalUrl = url + "?view_adult=true";
	try {
		const browser = await getBrowser();
		const page = await browser.newPage();
		await page.setUserAgent(
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
		);
		await page.goto(finalUrl, {
			waitUntil: "domcontentloaded",
			timeout: 60000,
		});
		await page.waitForSelector("dl.meta", { timeout: 10000 });
		const html = await page.content();
		await page.close();
		const $ = cheerio.load(html);
		if ($("dl.meta").length === 0) {
			console.log("Blocked or invalid:", url);
			return null;
		}
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
			current = parseInt(curr) || 0;
			total = tot === "?" ? null : parseInt(tot);
			completed = total !== null && current === total;
		}
		const summary = $(".summary .userstuff").text().replace(/\s+/g, " ").trim();
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
			summary,
			url,
		};
	} catch (err) {
		console.error("Scrape failed:", url, err.message);
		return null;
	}
}
