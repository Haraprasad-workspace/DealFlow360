import { useAuth } from "@clerk/react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import useCurrentUser from "../hooks/useCurrentUser";

const AdminShell = () => {
	const { user } = useCurrentUser();
	const { signOut } = useAuth();
	const navigate = useNavigate();
	const canDiscount = user?.role === "ADMIN" || user?.permissions?.canConfigure?.includes("discountTiers");

	const handleSignOut = async () => {
		await signOut();
		navigate("/auth", { replace: true });
	};

	return (
		<div className="min-h-screen bg-[#FAFAFC] font-['Inter',sans-serif] text-[#1A1B25]">
			<header className="border-b border-[#D6D7E4] bg-white">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
					<Link to="/admin/dashboard" className="text-lg font-bold">DealFlow360</Link>
					<nav className="flex flex-wrap items-center gap-4 text-sm text-[#5C5D6E]">
						<Link to="/admin/dashboard">Dashboard</Link>
						<Link to="/catalog">Catalog</Link>
						{canDiscount ? <Link to="/admin/discount-tiers">Discounts</Link> : null}
						{user?.role === "ADMIN" ? <><Link to="/admin/warehouses">Warehouses</Link><Link to="/admin/subscription-plans">Subscriptions</Link></> : null}
						<button type="button" onClick={handleSignOut} className="border-l border-[#D6D7E4] pl-4 text-[#955347] hover:text-[#A85C39]">
							Sign out
						</button>
					</nav>
				</div>
			</header>
			<Outlet />
		</div>
	);
};

export default AdminShell;
