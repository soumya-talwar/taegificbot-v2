import { searchFics } from "../src/search.js";

export default async function handler(req, res) {
	try {
		const { query } = req.query;
		if (!query)
			return res.status(400).json({ error: "Missing query parameter" });
		const results = await searchFics(query);
		return res.status(200).json({
			query,
			results,
		});
	} catch (err) {
		return res.status(500).json({
			error: err.message || "Something went wrong",
		});
	}
}
