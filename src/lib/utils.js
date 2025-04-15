export function cleanGiftData(gifts) {
	return gifts.map(
		({
			availabilityIssued,
			availabilityTotal,
			backdropData,
			message_in_channel,
			limited,
			auction,
			...cleanItem
		}) => cleanItem
	);
}
