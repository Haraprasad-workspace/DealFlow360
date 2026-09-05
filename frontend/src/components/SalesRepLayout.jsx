import { useAuth } from "@clerk/react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useCurrentUser from "../hooks/useCurrentUser";

const navItems = [
	["/sales-rep/dashboard", "Overview", "01"],
	["/sales-rep/customers", "Customers", "02"],
	["/sales-rep/products", "Products", "03"],
	["/sales-rep/quotations", "Quotations", "04"],
	["/sales-rep/orders", "Orders", "05"],
];

const SalesRepLayout = () => {
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
				<div className="brand-mark"><span>DF</span><div><strong>DealFlow</strong><small>sales operations</small></div></div>
				<div className="sidebar-rule" />
				<p className="eyebrow">Workspace</p>
				<nav className="workspace-nav">
					{navItems.map(([path, label, number]) => (
						<NavLink key={path} to={path} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
							<span className="nav-number">{number}</span><span>{label}</span>
						</NavLink>
					))}
				</nav>
				<div className="sidebar-bottom">
					<div className="signal"><span className="signal-dot" />All systems operational</div>
					<button className="signout-button" onClick={handleSignOut}>Sign out <span>↗</span></button>
				</div>
			</aside>
			<main className="workspace-main">
				<header className="workspace-topbar">
					<div className="mobile-brand"><span>DF</span><strong>DealFlow</strong></div>
					<div className="topbar-context"><span className="context-dot" />Sales workspace <span>/</span> {user?.role || "Internal"}</div>
					<div className="user-chip"><span>{(user?.name || user?.email || "S").slice(0, 1).toUpperCase()}</span><div><strong>{user?.name || "Sales Rep"}</strong><small>{user?.email || "Connected account"}</small></div></div>
				</header>
				<div className="workspace-content"><Outlet /></div>
			</main>
		</div>
	);
};

export default SalesRepLayout;
