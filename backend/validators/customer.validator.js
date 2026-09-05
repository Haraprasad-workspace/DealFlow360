const Joi = require("joi");

const address = Joi.object({
	street: Joi.string().trim(),
	city: Joi.string().trim(),
	state: Joi.string().trim(),
	country: Joi.string().trim(),
	pincode: Joi.string().trim(),
});

const fields = {
	name: Joi.string().trim().min(1),
	email: Joi.string().trim().lowercase().email(),
	phone: Joi.string().trim(),
	company: Joi.string().trim().min(1),
	tier: Joi.string().valid("BRONZE", "SILVER", "GOLD"),
	address,
};

const create = Joi.object({
	...fields,
	name: fields.name.required(),
	email: fields.email.required(),
	company: fields.company.required(),
}).required();

const update = Joi.object(fields).min(1).required();

const createCustomer = Joi.object({ body: create });
const updateCustomer = Joi.object({
	body: update,
	params: Joi.object({ customerId: Joi.string().hex().length(24).required() }),
});
const customerId = Joi.object({
	params: Joi.object({ customerId: Joi.string().hex().length(24).required() }),
});
const listCustomers = Joi.object({
	query: Joi.object({
		page: Joi.number().integer().min(1),
		limit: Joi.number().integer().min(1).max(100),
		search: Joi.string().trim(),
		tier: Joi.string().valid("BRONZE", "SILVER", "GOLD"),
	}),
});

module.exports = { createCustomer, updateCustomer, customerId, listCustomers };
