function normalize(text) {
	return text.toLowerCase().trim();
}

function extractLengthPreference(q) {
	if (q.includes("drabble")) return "drabble";
	if (q.includes("short") || q.includes("quick")) return "short";
	if (q.includes("medium")) return "medium";
	if (q.includes("long")) return "long";
	if (q.includes("epic")) return "epic";
	return null;
}

function extractQueryFeatures(query) {
	const q = query.toLowerCase();
	return {
		tags: q.split(" "),
		length: extractLengthPreference(q),
		wantsComplete: q.includes("complete"),
	};
}

function computeTagMatchScore(queryTags, ficTags) {
	let score = 0;
	const normalizedFicTags = ficTags.map(normalize);
	for (const tag of queryTags) {
		if (normalizedFicTags.some((t) => t.includes(tag))) {
			score += 1;
		}
	}
	return score;
}

function scoreFic(fic, queryFeatures) {
	let score = fic.similarity || 0;
	const tagScore = computeTagMatchScore(queryFeatures.tags, fic.tags);
	score += tagScore * 0.1;
	if (queryFeatures.length && fic.length === queryFeatures.length) score += 0.2;
	if (queryFeatures.wantsComplete && fic.completed) score += 0.1;
	return score;
}

export function rankFics(fics, query) {
	const queryFeatures = extractQueryFeatures(query);
	return fics
		.map((fic) => ({
			...fic,
			finalScore: scoreFic(fic, queryFeatures),
		}))
		.sort((a, b) => b.finalScore - a.finalScore);
}
