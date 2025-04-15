export interface Gift {
	gift_id: number;
	gift_num: number;
	gift_name: string;
	model: string;
	symbol?: string;
	backdrop?: string;
	price: number;
	export_at: string;
	animation?: string;
	tgs?: string;
	[key: string]: any;
}

export interface GiftResponse {
	last_updated: string;
	listings: Gift[];
	gift_name: string;
	filters: GiftFilters;
}

export interface GiftFilters {
	model?: string;
	backdrop?: string;
	symbol?: string;
	priceRange?: [number, number];
	giftNum?: number;
}

export interface FilterParams {
	model: string | null;
	backdrop: string | null;
	symbol: string | null;
	price_range: string | null;
	gift_num: string | null;
}

export interface TonnelApiRequestBody {
	page: number;
	limit: number;
	sort: string;
	filter: string;
	ref: number;
	price_range: [number, number] | null;
	user_auth: string;
}

export interface ApiErrorResponse {
	error: string;
	filters_applied?: FilterParams;
}

export interface ApiSuccessResponse {
	last_updated: string;
	gift_name: string;
	total: number;
	filters_applied: FilterParams;
	listings: Gift[];
}
