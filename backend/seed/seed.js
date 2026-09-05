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
const customers = require("./customers");
const products = require("./products");
const subscriptionPlans = require("./subscriptionPlans");
const discountRules = require("./discountRules");
const buildUsers = require("./users");
const buildQuotations = require("./quotations");
const buildOrders = require("./orders");

const seed = async () => {
	try {
		await connectDB();
		const teamId = new mongoose.Types.ObjectId();
		await Promise.all([
			User.deleteMany({ clerkUserId: /^seed-/ }),
			Customer.deleteMany({}),
			Product.deleteMany({}),
			SubscriptionPlan.deleteMany({}),
			DiscountRule.deleteMany({}),
			Quotation.deleteMany({}),
			Order.deleteMany({}),
		]);
		const [createdCustomers, createdProducts, createdPlans, createdRules, createdUsers] = await Promise.all([
			Customer.insertMany(customers),
			Product.insertMany(products),
			SubscriptionPlan.insertMany(subscriptionPlans),
			DiscountRule.insertMany(discountRules),
			User.insertMany(buildUsers(teamId)),
		]);
		const manager = createdUsers.find((user) => user.role === "SALES_MANAGER");
		const salesReps = createdUsers.filter((user) => user.role === "SALES_REP");
		const createdQuotations = await Quotation.insertMany(buildQuotations({ customers: createdCustomers, products: createdProducts, salesReps }));
		const createdOrders = await Order.insertMany(buildOrders({ quotations: createdQuotations }));
		logger.info("Seed completed", {
			manager: manager.email,
			salesReps: salesReps.length,
			customers: createdCustomers.length,
			products: createdProducts.length,
			quotations: createdQuotations.length,
			orders: createdOrders.length,
			plans: createdPlans.length,
			discountRules: createdRules.length,
		});
	} catch (error) {
		logger.error("Seed failed", error.message);
		process.exitCode = 1;
	} finally {
		await mongoose.connection.close();
	}
};

seed();
