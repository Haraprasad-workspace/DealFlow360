module.exports = [
	{ name: "Business Laptop Pro", category: "Hardware", description: "14-inch productivity laptop", price: 85000, costPrice: 62000, unit: "piece", taxRate: 18, variants: [{ attribute: "RAM", values: ["16GB", "32GB"], extraPrice: 8000 }], isRecurring: false, isActive: true },
	{ name: "4K Business Monitor", category: "Hardware", description: "27-inch 4K monitor", price: 42000, costPrice: 28000, unit: "piece", taxRate: 18, variants: [], isRecurring: false, isActive: true },
	{ name: "Mechanical Keyboard", category: "Accessories", description: "Wireless mechanical keyboard", price: 6500, costPrice: 3600, unit: "piece", taxRate: 18, variants: [], isRecurring: false, isActive: true },
	{ name: "Ergonomic Mouse", category: "Accessories", description: "Silent ergonomic wireless mouse", price: 2800, costPrice: 1300, unit: "piece", taxRate: 18, variants: [], isRecurring: false, isActive: true },
	{ name: "Cloud Storage Pro", category: "Service", description: "Secure team cloud storage", price: 1200, costPrice: 500, unit: "user/month", taxRate: 18, variants: [{ attribute: "Storage", values: ["1TB", "5TB"], extraPrice: 700 }], isRecurring: true, isActive: true },
	{ name: "Premium Support", category: "Service", description: "Priority technical support", price: 18000, costPrice: 8500, unit: "account/year", taxRate: 18, variants: [], isRecurring: true, isActive: true },
];
