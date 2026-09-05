import useCurrentUser from "../hooks/useCurrentUser";

const DashboardPlaceholder = () => {
	const { user } = useCurrentUser();

	return (
		<div className="min-h-screen bg-[#FAFAFC] px-6 py-10 font-['Inter',sans-serif] text-[#1A1B25]">
			<div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-[0_1px_2px_rgba(30,26,80,0.04),0_2px_8px_rgba(30,26,80,0.06)]">
				<h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold">
					Sales Dashboard
				</h1>
				<p className="mt-2 text-sm text-[#5C5D6E]">
					Placeholder workspace for internal users. Quotations, pipeline, and
					module tabs will be added in future modules.
				</p>
				{user ? (
					<p className="mt-6 text-sm">
						Signed in as <strong>{user.name}</strong> ({user.role})
					</p>
				) : null}
			</div>
		</div>
	);
};

export default DashboardPlaceholder;
