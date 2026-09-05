const AuthTabs = ({ activeTab, onTabChange }) => (
	<div className="grid grid-cols-2 gap-2">
		<button
			type="button"
			onClick={() => onTabChange("login")}
			className={`auth-tab ${
				activeTab === "login"
					? "active"
					: ""
			}`}
		>
			Log In
		</button>
		<button
			type="button"
			onClick={() => onTabChange("signup")}
			className={`auth-tab ${
				activeTab === "signup"
					? "active"
					: ""
			}`}
		>
			Sign Up
		</button>
	</div>
);

export default AuthTabs;
