import express from "express";
import type { Response } from "express";
import dotenv from "dotenv";
import dataCollector from "./data-collector";
import { ApiErrorResponse, ApiSuccessResponse } from "./types";
import { extractFilters } from "./lib/utils";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

function handleApiError(
	res: Response,
	error: Error,
	message = "Internal server error"
): Response {
	console.error(message, error.message);
	return res.status(500).json({ error: message });
}
app.set("json spaces", 2);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/tonnel/:giftName", async (req: any, res: any) => {
	try {
		const giftName = req.params.giftName;
		const { filters, filterParams } = extractFilters(req);
		const data = await dataCollector.fetchDirectFromApi(giftName, filters);

		if (!data) {
			const errorResponse: ApiErrorResponse = {
				error: `Listings for "${giftName}" not found on Tonnel Network`,
				filters_applied: filterParams,
			};
			return res.status(404).json(errorResponse);
		}

		const successResponse: ApiSuccessResponse = {
			last_updated: data.last_updated,
			gift_name: data.gift_name || giftName,
			total: data.listings.length,
			filters_applied: {
				...filterParams,
				gift_num: data.filters?.giftNum?.toString() || filterParams.gift_num,
			},
			listings: data.listings,
		};

		return res.json(successResponse);
	} catch (error: any) {
		return handleApiError(res, error, "Error fetching listings");
	}
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	console.log(`API available at: http://localhost:${PORT}`);
});
