require("dotenv").config();

const mongoose = require("mongoose");
const logger = require("../utils/logger");
const connectDB = require("../config/mongoose_config");

const User = require("../models/User");
const Customer = require("../models/Customer");
const Product = require("../models/Product");
const SubscriptionPlan = require("../models/SubscriptionPlan");
const DiscountRule = require("../models/DiscountRule");
const Quotation = require("../models/Quotation");
const Order = require("../models/Order");
const DiscountTierConfig = require("../models/DiscountTierConfig");
const DiscountCategoryConfig = require("../models/DiscountCategoryConfig");
const Warehouse = require("../models/Warehouse");

const customers = require("./customers");
const products = require("./products");
const subscriptionPlans = require("./subscriptionPlans");
const discountRules = require("./discountRules");
const buildUsers = require("./users");
const buildQuotations = require("./quotations");
const buildOrders = require("./orders");
const discountTierConfigs = require("./discountTierConfigs");
const discountCategoryConfigs = require("./discountCategoryConfigs");
const warehouses = require("./warehouses");

const seed = async () => {
	try {
		await connectDB();

		const teamId = new mongoose.Types.ObjectId();

		// Clear existing seed/application data
		await Promise.all([
			User.deleteMany({ clerkUserId: /^seed-/ }),
			Customer.deleteMany({}),
			Product.deleteMany({}),
			SubscriptionPlan.deleteMany({}),
			DiscountRule.deleteMany({}),
			Quotation.deleteMany({}),
			Order.deleteMany({}),
			DiscountTierConfig.deleteMany({}),
			DiscountCategoryConfig.deleteMany({}),
			Warehouse.deleteMany({}),
		]);

		// Create base data
		const [
			createdCustomers,
			createdProducts,
			createdPlans,
			createdRules,
			createdUsers,
			createdTierConfigs,
			createdCategoryConfigs,
			createdWarehouses,
		] = await Promise.all([
			Customer.insertMany(customers),
			Product.insertMany(products),
			SubscriptionPlan.insertMany(subscriptionPlans),
			DiscountRule.insertMany(discountRules),
			User.insertMany(buildUsers(teamId)),
			DiscountTierConfig.insertMany(discountTierConfigs),
			DiscountCategoryConfig.insertMany(discountCategoryConfigs),
			Warehouse.insertMany(warehouses),
		]);

		// Find users
		const manager = createdUsers.find(
			(user) => user.role === "SALES_MANAGER"
		);

		const salesReps = createdUsers.filter(
			(user) => user.role === "SALES_REP"
		);

		// Create quotations
		const createdQuotations = await Quotation.insertMany(
			buildQuotations({
				customers: createdCustomers,
				products: createdProducts,
				salesReps,
			})
		);

		// Create orders
		const createdOrders = await Order.insertMany(
			buildOrders({
				quotations: createdQuotations,
			})
		);

		logger.info("Seed completed", {
			manager: manager?.email,
			salesReps: salesReps.length,
			customers: createdCustomers.length,
			products: createdProducts.length,
			quotations: createdQuotations.length,
			orders: createdOrders.length,
			plans: createdPlans.length,
			discountRules: createdRules.length,
			discountTierConfigs: createdTierConfigs.length,
			discountCategoryConfigs: createdCategoryConfigs.length,
			warehouses: createdWarehouses.length,
		});

		console.log(`Seeded ${createdCustomers.length} customers`);
		console.log(`Seeded ${createdProducts.length} products`);
		console.log(`Seeded ${createdPlans.length} subscription plans`);
		console.log(`Seeded ${createdRules.length} discount rules`);
		console.log(
			`Seeded ${createdTierConfigs.length} discount tier configs`
		);
		console.log(
			`Seeded ${createdCategoryConfigs.length} discount category configs`
		);
		console.log(`Seeded ${createdWarehouses.length} warehouses`);
	} catch (error) {
		logger.error("Seed failed", error.message);
		process.exitCode = 1;
	} finally {
		await mongoose.connection.close();
	}
};

seed();