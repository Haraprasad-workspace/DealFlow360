module.exports = ({ quotations }) => {
	const approved = quotations.find((quotation) => quotation.quotationNumber === "QT-SEED-APPROVED");
	return [
		{
			orderNumber: "ORD-SEED-001",
			quotation: approved._id,
			customer: approved.customer,
			salesRep: approved.salesRep,
			items: approved.items.map((item) => ({ ...item.toObject?.() || item, billingType: "ONE_TIME" })),
			subtotal: approved.subtotal,
			discountTotal: approved.discountTotal,
			taxTotal: approved.taxTotal,
			grandTotal: approved.grandTotal,
			status: "PROCESSING",
		},
	];
};