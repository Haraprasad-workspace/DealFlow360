const validate = (schema) => (req, res, next) => {
	const schemaKeys = schema.describe().keys || {};
	const input = {};
	if (schemaKeys.body) input.body = req.body;
	if (schemaKeys.params) input.params = req.params;
	if (schemaKeys.query) input.query = req.query;
	const result = schema.validate(
		input,
		{ abortEarly: false, allowUnknown: false, stripUnknown: true },
	);

	if (result.error) {
		return res.status(400).json({
			success: false,
			message: "Validation failed",
			errors: result.error.details.map((detail) => ({
				field: detail.path.join("."),
				message: detail.message,
			})),
		});
	}

	if (result.value.body) req.body = result.value.body;
	if (result.value.params) req.params = result.value.params;
	if (result.value.query) req.query = result.value.query;
	return next();
};

module.exports = validate;
