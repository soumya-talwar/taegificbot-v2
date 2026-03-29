import fs from "fs";
const raw = JSON.parse(fs.readFileSync("data/fics.json"));

function normalizeShip(pairings) {
	const text = pairings[0].toLowerCase();
	const hasTaehyung = text.includes("taehyung");
	const hasYoongi = text.includes("yoongi");
	if (!(hasTaehyung && hasYoongi)) {
		return { ship: "unknown", variant: "unknown" };
	}
	if (text.includes("jimin")) return { ship: "taegi", variant: "taegimin" };
	if (text.includes("jungkook")) return { ship: "taegi", variant: "taegikook" };
	if (text.includes("seokjin")) return { ship: "taegi", variant: "taegijin" };
	if (text.includes("hoseok")) return { ship: "taegi", variant: "taegiseok" };
	if (text.includes("namjoon")) return { ship: "taegi", variant: "taegijoon" };
	return { ship: "taegi", variant: "taegi" };
}

function normalizeWarnings(warnings) {
	warnings = warnings.map((warning) => warning.toLowerCase());
	return warnings.filter((warning) => !warning.includes("no archive warnings"));
}

function getLengthCategory(words) {
	if (words < 2000) return "drabble";
	if (words < 10000) return "short";
	if (words < 30000) return "medium";
	if (words < 80000) return "long";
	return "epic";
}

function normalizeTags(tags) {
	return [
		...new Set(
			tags.map((tag) => tag.toLowerCase().replace(/\s+/g, " ").trim()),
		),
	];
}

function buildSearchText(fic) {
	return [
		fic.title,
		fic.summary,
		fic.authors.join(" "),
		fic.ship.ship,
		fic.ship.variant,
		fic.tags.join(" "),
		fic.warnings.join(" "),
	]
		.join(" ")
		.toLowerCase();
}

const cleaned = raw.map((fic) => {
	const ship = normalizeShip(fic.pairings);
	const warnings = normalizeWarnings(fic.warnings);
	const tags = normalizeTags(fic.tags);
	const processed = {
		title: fic.title,
		authors: fic.authors,
		ship,
		warnings,
		tags,
		wordCount: fic.words,
		length: getLengthCategory(fic.words),
		completed: fic.completed,
		language: fic.language.toLowerCase(),
		summary: fic.summary || "",
		url: fic.url,
	};
	processed.searchText = buildSearchText(processed);
	return processed;
});

fs.writeFileSync("data/fics_clean.json", JSON.stringify(cleaned, null, 2));
console.log("Data processed!");
