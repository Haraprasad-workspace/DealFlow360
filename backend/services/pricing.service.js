const calculateQuotationPricing = (quotationItems, customer) => {
	if (!Array.isArray(quotationItems) || quotationItems.length === 0) {
		const error = new Error("At least one quotation item is required");
		error.status = 400;
		throw error;
	}

	let subtotal = 0;
	let discountTotal = 0;
	let taxTotal = 0;
	let totalCost = 0;
	const items = quotationItems.map((item) => {
		const product = item.product?.price !== undefined ? item.product : item.productData;
		if (!product) {
			const error = new Error("Pricing requires product details on every item");
			error.status = 400;
			throw error;
		}
		const quantity = Number(item.quantity);
		const discount = Number(item.discount || 0);
		if (!Number.isFinite(quantity) || quantity < 1 || discount < 0 || discount > 100) {
			const error = new Error("Invalid quantity or discount");
			error.status = 400;
			throw error;
		}
		const grossAmount = product.price * quantity;
		const discountAmount = grossAmount * (discount / 100);
		const netAmount = grossAmount - discountAmount;
		const taxAmount = netAmount * ((product.taxRate || 0) / 100);
		const lineTotal = netAmount + taxAmount;
		const cost = (product.costPrice || 0) * quantity;
		const profit = netAmount - cost;
		subtotal += grossAmount;
		discountTotal += discountAmount;
		taxTotal += taxAmount;
		totalCost += cost;
		return {
			product: product._id,
			quantity,
			unitPrice: product.price,
			discount,
			tax: taxAmount,
			total: lineTotal,
			grossAmount,
			discountAmount,
			netAmount,
			taxAmount,
			lineTotal,
			cost,
			profit,
			margin: lineTotal ? (profit / lineTotal) * 100 : 0,
		};
	});
	const grandTotal = subtotal - discountTotal + taxTotal;
	const totalProfit = grandTotal - totalCost;
	return {
		items,
		subtotal,
		discountTotal,
		taxTotal,
		grandTotal,
		totalCost,
		totalProfit,
		margin: grandTotal ? (totalProfit / grandTotal) * 100 : 0,
		customerTier: customer?.tier,
	};
};

module.exports = { calculateQuotationPricing, calculatePricing: calculateQuotationPricing };
