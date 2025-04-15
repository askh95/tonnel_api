import express from "express";
import dotenv from "dotenv";
import dataCollector from "./data-collector.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

function handleApiError(res, error, message = "Internal server error") {
	console.error(message, error.message);
	return res.status(500).json({ error: message });
}

function extractFilters(req) {
	const modelFilter = req.query.m || req.query.model;
	const backdropFilter = req.query.b || req.query.backdrop;
	const symbolFilter = req.query.s || req.query.symbol;
	const priceRangeFilter = req.query.r || req.query.range;
	const giftNumFilter = req.query.n || req.query.num;

	const filters = {};
	if (modelFilter) filters.model = modelFilter;
	if (backdropFilter) filters.backdrop = backdropFilter;
	if (symbolFilter) filters.symbol = symbolFilter;

	if (giftNumFilter) {
		const giftNum = Number.parseInt(giftNumFilter, 10);
		if (!Number.isNaN(giftNum)) {
			filters.giftNum = giftNum;
		}
	}

	if (priceRangeFilter) {
		const [minPrice, maxPrice] = priceRangeFilter.split("-").map(Number);
		if (!Number.isNaN(minPrice) && !Number.isNaN(maxPrice)) {
			filters.priceRange = [minPrice, maxPrice];
		}
	}

	return {
		filters,
		filterParams: {
			model: modelFilter || null,
			backdrop: backdropFilter || null,
			symbol: symbolFilter || null,
			price_range: priceRangeFilter || null,
			gift_num: giftNumFilter || null,
		},
	};
}

app.set("json spaces", 2);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/tonnel/:giftName", async (req, res) => {
	try {
		const giftName = req.params.giftName;
		const { filters, filterParams } = extractFilters(req);
		const data = await dataCollector.fetchDirectFromApi(giftName, filters);

		if (!data) {
			return res.status(404).json({
				error: `Listings for "${giftName}" not found on Tonnel Network`,
				filters_applied: filterParams,
			});
		}

		// Use the cleaned gift name from the data response
		return res.json({
			last_updated: data.last_updated,
			gift_name: data.gift_name || giftName,
			total: data.listings.length,
			filters_applied: {
				...filterParams,
				gift_num: data.filters?.giftNum?.toString() || filterParams.gift_num,
			},
			listings: data.listings,
		});
	} catch (error) {
		return handleApiError(res, error, "Error fetching listings");
	}
});

app.get("/api/purchase/:giftId", async (req, res) => {
	try {
		const giftId = req.params.giftId;
		const price = req.query.price;

		if (!price) {
			return res.status(400).json({
				error: "Missing required parameter: price must be provided",
			});
		}

		const purchaseResult = await purchaseGift(giftId, price);
		return res.json(purchaseResult);
	} catch (error) {
		return handleApiError(res, error, "Error during gift purchase");
	}
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	console.log(`API available at: http://localhost:${PORT}`);
});
