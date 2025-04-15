const PAGE_LIMIT = 100;

const API_HEADERS = {
	accept: "*/*",
	"accept-language": "ru,en;q=0.9",
	"content-type": "application/json",
	"sec-ch-ua": '"Chromium";v="133", "Not(A:Brand";v="99"',
	"sec-ch-ua-mobile": "?0",
	"sec-ch-ua-platform": '"Windows"',
};

export { API_HEADERS };

async function fetchFromTonnel(body, retryCount = 0) {
	try {
		const response = await fetch(
			"https://gifts2.tonnel.network/api/pageGifts",
			{
				method: "POST",
				headers: API_HEADERS,
				body: JSON.stringify(body),
			}
		);

		const text = await response.text();
		return JSON.parse(text);
	} catch (error) {
		if (retryCount < 3) {
			console.log(`API error, retrying in 10s... (${retryCount + 1}/3)`);
			await new Promise((resolve) => setTimeout(resolve, 10000));
			return fetchFromTonnel(body, retryCount + 1);
		}
		throw error;
	}
}

export async function fetchGiftsDirectlyFromTonnel(
	giftName,
	filters = {},
	specificGiftNum = null
) {
	let allGifts = [];
	let page = 1;
	let hasMorePages = true;
	const foundSpecificGift = false;

	const filterObj = {
		price: { $exists: true },
		refunded: { $ne: true },
		buyer: { $exists: false },
		export_at: { $exists: true },
		gift_name: giftName,
		asset: "TON",
	};

	if (filters.model) filterObj.model = { $regex: filters.model, $options: "i" };
	if (filters.backdrop)
		filterObj.backdrop = { $regex: filters.backdrop, $options: "i" };
	if (filters.symbol)
		filterObj.symbol = { $regex: filters.symbol, $options: "i" };
	if (filters.giftNum) filterObj.gift_num = filters.giftNum;

	let priceRange = null;
	if (filters.priceRange && filters.priceRange.length === 2) {
		const [minPrice, maxPrice] = filters.priceRange;
		if (!Number.isNaN(minPrice) && !Number.isNaN(maxPrice)) {
			priceRange = [minPrice, maxPrice];
		}
	}

	let sortObj = { price: 1, gift_id: -1 };
	if (specificGiftNum !== null || filters.giftNum) {
		sortObj = { gift_num: 1, price: 1 };
	}

	while (hasMorePages && !foundSpecificGift) {
		process.stdout.write(".");

		try {
			const body = {
				page,
				limit: PAGE_LIMIT,
				sort: JSON.stringify(sortObj),
				filter: JSON.stringify(filterObj),
				ref: 0,
				price_range: priceRange,
				user_auth: process.env.USER_AUTH || "",
			};

			const results = await fetchFromTonnel(body);

			if (results && results.length > 0) {
				if (specificGiftNum !== null || filters.giftNum) {
					return results;
				} else {
					allGifts = [...allGifts, ...results];
				}

				page++;
			} else {
				hasMorePages = false;
			}

			await new Promise((resolve) => setTimeout(resolve, 300));
		} catch (error) {
			console.error(`Error fetching from Tonnel API: ${error.message}`);
			hasMorePages = false;
		}
	}

	console.log(` Found ${allGifts.length} listings`);
	return allGifts;
}
