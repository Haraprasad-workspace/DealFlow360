const format = (level, message, details) => {
	const suffix = details === undefined ? "" : ` ${JSON.stringify(details)}`;
	return `[${new Date().toISOString()}] ${level} ${message}${suffix}`;
};

const logger = {
	info(message, details) {
		console.info(format("INFO", message, details));
	},
	warn(message, details) {
		console.warn(format("WARN", message, details));
	},
	error(message, details) {
		console.error(format("ERROR", message, details));
	},
};

module.exports = logger;
