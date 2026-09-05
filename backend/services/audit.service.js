const AuditLog = require("../models/AuditLog");

const createAuditLog = (data) => AuditLog.create(data);

module.exports = { createAuditLog };
