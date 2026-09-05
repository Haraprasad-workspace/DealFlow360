import { useAuth } from "@clerk/react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useCurrentUser from "../hooks/useCurrentUser";

const navItems = [
	["/sales-manager/dashboard", "Dashboard", "01"],
	["/sales-manager/approvals", "Approvals", "02"],
	["/sales-manager/quotations", "Quotations", "03"],
	["/sales-manager/orders", "Orders", "04"],
	["/sales-manager/reports", "Reports", "05"],
];

const SalesManagerLayout = () => {
	const { signOut } = useAuth();
	const { user } = useCurrentUser();
	const navigate = useNavigate();

	const handleSignOut = async () => {
		await signOut();
		navigate("/auth");
	};

	return (
		<div className="workspace-shell">
			<aside className="workspace-sidebar">
				<div className="brand-mark">
					<span>DF</span>
					<div>
						<strong>DealFlow</strong>
						<small>Manager operations</small>
					</div>
				</div>

				<div className="sidebar-rule" />

				<p className="eyebrow">Manager Suite</p>

				<nav className="workspace-nav">
					{navItems.map(([path, label, number]) => (
						<NavLink
							key={path}
							to={path}
							className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
						>
							<span className="nav-number">{number}</span>
							<span>{label}</span>
						</NavLink>
					))}
				</nav>

				<div className="sidebar-bottom">
					<div className="signal">
						<span className="signal-dot" /> Manager Governance Active
					</div>
					<button type="button" className="signout-button" onClick={handleSignOut}>
						Sign out <span>↗</span>
					</button>
				</div>
			</aside>

			<main className="workspace-main">
				<header className="workspace-topbar">
					<div className="mobile-brand">
						<span>DF</span>
						<strong>DealFlow</strong>
					</div>

					<div className="topbar-context">
						<span className="context-dot" />
						Sales Management Workspace <span>/</span> {user?.role || "SALES_MANAGER"}
					</div>

					<div className="user-chip">
						<span>{(user?.name || user?.email || "M").slice(0, 1).toUpperCase()}</span>
						<div>
							<strong>{user?.name || "Sales Manager"}</strong>
							<small>{user?.email || "Manager Account"}</small>
						</div>
					</div>
				</header>

				<div className="workspace-content">
					<Outlet />
				</div>
			</main>
		</div>
	);
};

export default SalesManagerLayout;
