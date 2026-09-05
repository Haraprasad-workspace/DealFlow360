const service = require("../services/financeApproval.service");

const getPending = async (request, response, next) => {
	try { return response.json(await service.listPending()); } catch (error) { return next(error); }
};

const approve = async (request, response, next) => {
	try { return response.json(await service.approve(request.user._id, request.params.quotationId)); } catch (error) { return next(error); }
};

const reject = async (request, response, next) => {
	try { return response.json(await service.reject(request.user._id, request.params.quotationId, request.body?.reason)); } catch (error) { return next(error); }
};

module.exports = { getPending, approve, reject };
