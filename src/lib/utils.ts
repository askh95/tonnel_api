import type { Request } from "express";
import { FilterParams, Gift, GiftFilters } from "../types";

export function cleanGiftData(gifts: any[]): Gift[] {
	return gifts.map(
		({
			availabilityIssued,
			availabilityTotal,
			backdropData,
			message_in_channel,
			limited,
			auction,
			...cleanItem
		}) => cleanItem as Gift
	);
}

export function extractFilters(req: Request): {
	filters: GiftFilters;
	filterParams: FilterParams;
} {
	const modelFilter = req.query.m?.toString() || req.query.model?.toString();
	const backdropFilter =
		req.query.b?.toString() || req.query.backdrop?.toString();
	const symbolFilter = req.query.s?.toString() || req.query.symbol?.toString();
	const priceRangeFilter =
		req.query.r?.toString() || req.query.range?.toString();
	const giftNumFilter = req.query.n?.toString() || req.query.num?.toString();

	const filters: GiftFilters = {};
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
