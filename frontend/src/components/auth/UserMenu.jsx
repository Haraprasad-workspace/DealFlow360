import { SignOutButton } from "@clerk/react";

const UserMenu = () => (
	<div className="flex justify-end">
		<SignOutButton>
			<button
				type="button"
				className="rounded-lg border border-[#D6D7E4] bg-white px-4 py-2 text-sm font-medium text-[#1A1B25] transition-colors hover:bg-[#FAFAFC]"
			>
				Log out
			</button>
		</SignOutButton>
	</div>
);

export default UserMenu;
