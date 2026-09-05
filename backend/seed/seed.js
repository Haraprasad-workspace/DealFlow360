require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/mongoose_config");
const Customer = require("../models/Customer");
const Product = require("../models/Product");
const SubscriptionPlan = require("../models/SubscriptionPlan");
const DiscountRule = require("../models/DiscountRule");
const customers = require("./customers");
const products = require("./products");
const subscriptionPlans = require("./subscriptionPlans");
const discountRules = require("./discountRules");

const seed = async () => {
	try {
		await connectDB();
		await Promise.all([
			Customer.deleteMany({}),
			Product.deleteMany({}),
			SubscriptionPlan.deleteMany({}),
			DiscountRule.deleteMany({}),
		]);
		const [createdCustomers, createdProducts, createdPlans, createdRules] = await Promise.all([
			Customer.insertMany(customers),
			Product.insertMany(products),
			SubscriptionPlan.insertMany(subscriptionPlans),
			DiscountRule.insertMany(discountRules),
		]);
		console.log(`Seeded ${createdCustomers.length} customers`);
		console.log(`Seeded ${createdProducts.length} products`);
		console.log(`Seeded ${createdPlans.length} subscription plans`);
		console.log(`Seeded ${createdRules.length} discount rules`);
	} catch (error) {
		console.error("Seed failed:", error.message);
		process.exitCode = 1;
	} finally {
		await mongoose.connection.close();
	}
};

seed();
