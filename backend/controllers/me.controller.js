const getMe = (request, response) => {
	response.json(request.user);
};

module.exports = {
	getMe,
};
