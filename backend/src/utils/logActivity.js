const ActivityLog = require("../models/ActivityLog");

// helper to log user activity without cluttering controllers
const logActivity = async (userId, action, details = "", ipAddress = "") => {
    try {
        await ActivityLog.create({
            user: userId,
            action,
            details,
            ipAddress
        });
    } catch (error) {
        // don't let logging failures break the main flow
        console.error("Failed to log activity:", error.message);
    }
};

module.exports = logActivity;
