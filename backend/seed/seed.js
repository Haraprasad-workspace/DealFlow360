require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/mongoose_config");
const Customer = require("../models/Customer");
const Product = require("../models/Product");
const SubscriptionPlan = require("../models/SubscriptionPlan");
const DiscountRule = require("../models/DiscountRule");
const DiscountTierConfig = require("../models/DiscountTierConfig");
const Warehouse = require("../models/Warehouse");
const customers = require("./customers");
const products = require("./products");
const subscriptionPlans = require("./subscriptionPlans");
const discountRules = require("./discountRules");
const discountTierConfigs = require("./discountTierConfigs");
const warehouses = require("./warehouses");

const seed = async () => {
	try {
		await connectDB();
		await Promise.all([
			Customer.deleteMany({}),
			Product.deleteMany({}),
			SubscriptionPlan.deleteMany({}),
			DiscountRule.deleteMany({}),
			DiscountTierConfig.deleteMany({}),
			Warehouse.deleteMany({}),
		]);
		const [createdCustomers, createdProducts, createdPlans, createdRules, createdTierConfigs, createdWarehouses] = await Promise.all([
			Customer.insertMany(customers),
			Product.insertMany(products),
			SubscriptionPlan.insertMany(subscriptionPlans),
			DiscountRule.insertMany(discountRules),
			DiscountTierConfig.insertMany(discountTierConfigs),
			Warehouse.insertMany(warehouses),
		]);
		console.log(`Seeded ${createdCustomers.length} customers`);
		console.log(`Seeded ${createdProducts.length} products`);
		console.log(`Seeded ${createdPlans.length} subscription plans`);
		console.log(`Seeded ${createdRules.length} discount rules`);
		console.log(`Seeded ${createdTierConfigs.length} discount tier configs`);
		console.log(`Seeded ${createdWarehouses.length} warehouses`);
	} catch (error) {
		console.error("Seed failed:", error.message);
		process.exitCode = 1;
	} finally {
		await mongoose.connection.close();
	}
};

seed();
