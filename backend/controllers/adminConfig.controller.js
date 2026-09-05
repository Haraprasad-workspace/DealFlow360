const service = require("../services/adminConfig.service");

const handle = (callback) => async (req, res, next) => {
	try { return await callback(req, res); } catch (error) {
		if (error.status) return res.status(error.status).json({ message: error.message });
		return next(error);
	}
};

const list = handle(async (req, res) => res.json(await service.list(req.params.resource, req.query)));
const get = handle(async (req, res) => res.json(await service.get(req.params.resource, req.params.id)));
const create = handle(async (req, res) => res.status(201).json(await service.create(req.params.resource, req.body)));
const update = handle(async (req, res) => res.json(await service.update(req.params.resource, req.params.id, req.body)));
const remove = handle(async (req, res) => res.json({ message: "Resource deleted", resource: await service.remove(req.params.resource, req.params.id) }));
const getApprovalConfig = handle(async (_req, res) => res.json(await service.getApprovalConfig()));
const saveApprovalConfig = handle(async (req, res) => res.status(201).json(await service.saveApprovalConfig(req.body, req.user?._id)));

module.exports = { list, get, create, update, remove, getApprovalConfig, saveApprovalConfig };
