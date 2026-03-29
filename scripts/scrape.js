import { scrapeFic } from "../src/scraper.js";

const testUrl = "https://archiveofourown.org/works/26291614/";

(async () => {
	const fic = await scrapeFic(testUrl);
	console.log(JSON.stringify(fic, null, 2));
})();
