import { fetchGiftsDirectlyFromTonnel } from "./lib/api-client";
import { cleanGiftData } from "./lib/utils";
import { GiftFilters, GiftResponse, Gift } from "./types";

async function fetchDirectFromApi(
	giftNameWithPossibleNum: string,
	filters: GiftFilters = {}
): Promise<GiftResponse | null> {
	try {
		const giftNumMatch = giftNameWithPossibleNum.match(/^(.+)-(\d+)$/);
		let giftName = giftNameWithPossibleNum;
		let specificGiftNum = filters.giftNum || null;

		if (!specificGiftNum && giftNumMatch) {
			giftName = giftNumMatch[1];
			specificGiftNum = Number.parseInt(giftNumMatch[2], 10);
			filters.giftNum = specificGiftNum;
		}

		const gifts = await fetchGiftsDirectlyFromTonnel(
			giftName,
			filters,
			specificGiftNum
		);

		if (!gifts || gifts.length === 0) {
			return null;
		}

		const cleanedGifts = cleanGiftData(gifts);

		const enhancedGifts: Gift[] = cleanedGifts.map((gift) => {
			const normalizedName = giftName.replace(/\s+/g, "").toLowerCase();
			const animationUrl = `https://nft.fragment.com/gift/${normalizedName}-${gift.gift_num}.lottie.json`;
			const tgsUrl = `https://nft.fragment.com/gift/${normalizedName}-${gift.gift_num}.tgs`;

			return {
				...gift,
				animation: animationUrl,
				tgs: tgsUrl,
			};
		});

		return {
			last_updated: new Date().toISOString(),
			listings: enhancedGifts,
			gift_name: giftName,
			filters: filters,
		};
	} catch (error: any) {
		console.error(`Error in API fetch: ${error.message}`);
		return null;
	}
}

export default {
	fetchDirectFromApi,
};
