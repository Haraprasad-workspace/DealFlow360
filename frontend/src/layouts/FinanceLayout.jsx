import { useAuth } from "@clerk/react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useCurrentUser from "../hooks/useCurrentUser";

const FinanceLayout = () => {
	const { signOut } = useAuth();
	const { user } = useCurrentUser();
	const navigate = useNavigate();
	return <div className="workspace-shell"><aside className="workspace-sidebar"><div className="brand-mark"><span>DF</span><div><strong>DealFlow</strong><small>Finance operations</small></div></div><div className="sidebar-rule" /><p className="eyebrow">Finance Suite</p><nav className="workspace-nav"><NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/finance/approvals"><span className="nav-number">01</span><span>Approvals</span></NavLink></nav><div className="sidebar-bottom"><div className="signal"><span className="signal-dot" /> Finance Governance Active</div><button type="button" className="signout-button" onClick={async () => { await signOut(); navigate("/auth"); }}>Sign out <span>↗</span></button></div></aside><main className="workspace-main"><header className="workspace-topbar"><div className="topbar-context"><span className="context-dot" /> Finance Workspace <span>/</span> {user?.role || "FINANCE"}</div><div className="user-chip"><span>{(user?.name || "F").slice(0, 1).toUpperCase()}</span><div><strong>{user?.name || "Finance User"}</strong><small>{user?.email || "Finance Account"}</small></div></div></header><div className="workspace-content"><Outlet /></div></main></div>;
};

export default FinanceLayout;
