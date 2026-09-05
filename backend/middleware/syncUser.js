const { clerkClient, getAuth } = require("@clerk/express");
const User = require("../models/User");
const { USER_ROLES, isValidRole } = require("../constants/userRoles");
const { buildPermissionsForRole } = require("../utils/buildPermissions");

const getPrimaryEmail = (clerkUser) => {
	const primaryEmail = clerkUser.emailAddresses.find(
		(emailAddress) =>
			emailAddress.id === clerkUser.primaryEmailAddressId,
	);

	return primaryEmail?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress || "";
};

const getDisplayName = (clerkUser, email) => {
	const fullName = [clerkUser.firstName, clerkUser.lastName]
		.filter(Boolean)
		.join(" ")
		.trim();

	return fullName || email;
};

const syncUser = async (request, response, next) => {
	try {
		const { userId } = getAuth(request);

		if (!userId) {
			return response.status(401).json({ error: "Unauthorized" });
		}

		let user = await User.findOne({ clerkUserId: userId });

		if (!user) {
			const clerkUser = await clerkClient.users.getUser(userId);
			const metadataRole = clerkUser.unsafeMetadata?.role;
			let role = USER_ROLES.SALES_REP;

			if (metadataRole && isValidRole(metadataRole)) {
				role = metadataRole;
			} else {
				console.warn(
					`[syncUser] Missing or invalid unsafeMetadata.role for clerkUserId=${userId}, defaulting to SALES_REP`,
				);
			}

			// TODO: add admin-approval or invite-gating for privileged roles before production

			const email = getPrimaryEmail(clerkUser);
			const name = getDisplayName(clerkUser, email);

			user = await User.create({
				clerkUserId: userId,
				email,
				name,
				role,
				permissions: buildPermissionsForRole(role),
				lastLoginAt: new Date(),
			});
		} else {
			user.lastLoginAt = new Date();
			await user.save();
		}

		console.info(`[syncUser] Synced user '${user.email}' (${user.role}) | teamId: ${user.teamId || "none"}`);
		request.user = user;
		next();
	} catch (error) {
		next(error);
	}
};

module.exports = syncUser;
