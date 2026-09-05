const line = (product, quantity, discount, taxRate = product.taxRate) => {
	const gross = product.price * quantity;
	const discountAmount = gross * (discount / 100);
	const net = gross - discountAmount;
	const tax = net * (taxRate / 100);
	const total = net + tax;
	return {
		product: product._id,
		quantity,
		unitPrice: product.price,
		discount,
		tax,
		total,
		margin: total ? ((total - product.costPrice * quantity) / total) * 100 : 0,
	};
};

const buildQuotation = ({ number, customer, salesRep, items, status, riskScore, riskLevel, approval }) => {
	const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
	const discountTotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity * item.discount) / 100, 0);
	const taxTotal = items.reduce((sum, item) => sum + item.tax, 0);
	const grandTotal = subtotal - discountTotal + taxTotal;
	const totalCost = items.reduce((sum, item) => sum + (item.productData?.costPrice || 0) * item.quantity, 0);
	return {
		quotationNumber: number,
		customer: customer._id,
		salesRep: salesRep._id,
		items: items.map(({ productData, ...item }) => item),
		subtotal,
		discountTotal,
		taxTotal,
		grandTotal,
		margin: grandTotal ? ((grandTotal - totalCost) / grandTotal) * 100 : 0,
		riskScore,
		riskLevel,
		status,
		approval,
	};
};

module.exports = ({ customers, products, salesReps }) => {
	const [bronze, silver, gold] = customers;
	const laptop = products.find((product) => product.name === "Business Laptop Pro");
	const monitor = products.find((product) => product.name === "4K Business Monitor");
	const keyboard = products.find((product) => product.name === "Mechanical Keyboard");
	const support = products.find((product) => product.name === "Premium Support");
	const [arjun, diya] = salesReps;
	const make = (product, quantity, discount) => {
		const productLine = line(product, quantity, discount);
		return { ...productLine, productData: product };
	};

	return [
		buildQuotation({ number: "QT-SEED-DRAFT", customer: bronze, salesRep: arjun, items: [make(keyboard, 2, 0)], status: "DRAFT", riskScore: 0, riskLevel: "LOW", approval: { required: false, currentLevel: "NONE", status: "NOT_REQUIRED" } }),
		buildQuotation({ number: "QT-SEED-PENDING", customer: silver, salesRep: arjun, items: [make(laptop, 1, 12), make(monitor, 2, 8)], status: "PENDING_APPROVAL", riskScore: 45, riskLevel: "MEDIUM", approval: { required: true, currentLevel: "MANAGER", status: "PENDING" } }),
		buildQuotation({ number: "QT-SEED-APPROVED", customer: gold, salesRep: diya, items: [make(monitor, 1, 5), make(keyboard, 1, 5)], status: "APPROVED", riskScore: 10, riskLevel: "LOW", approval: { required: true, currentLevel: "MANAGER", status: "APPROVED" } }),
		buildQuotation({ number: "QT-SEED-REJECTED", customer: bronze, salesRep: diya, items: [make(support, 1, 25)], status: "REJECTED", riskScore: 85, riskLevel: "HIGH", approval: { required: true, currentLevel: "FINANCE", status: "REJECTED" } }),
	];
};