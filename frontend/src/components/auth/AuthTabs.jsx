const AuthTabs = ({ activeTab, onTabChange }) => (
	<div className="grid grid-cols-2 gap-2">
		<button
			type="button"
			onClick={() => onTabChange("login")}
			className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
				activeTab === "login"
					? "bg-[#5B4CF5] text-white"
					: "border border-[#D6D7E4] bg-white text-[#1A1B25]"
			}`}
		>
			Log In
		</button>
		<button
			type="button"
			onClick={() => onTabChange("signup")}
			className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
				activeTab === "signup"
					? "bg-[#5B4CF5] text-white"
					: "border border-[#D6D7E4] bg-white text-[#1A1B25]"
			}`}
		>
			Sign Up
		</button>
	</div>
);

export default AuthTabs;
