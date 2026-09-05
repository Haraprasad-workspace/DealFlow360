import { Link, Outlet } from "react-router-dom";
import useCurrentUser from "../hooks/useCurrentUser";

const AdminShell = () => {
	const { user } = useCurrentUser();
	const canDiscount = user?.role === "ADMIN" || user?.permissions?.canConfigure?.includes("discountTiers");
	return (
		<div className="min-h-screen bg-[#FAFAFC] font-['Inter',sans-serif] text-[#1A1B25]">
			<header className="border-b border-[#D6D7E4] bg-white">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
					<Link to="/dashboard" className="text-lg font-bold">DealFlow360</Link>
					<nav className="flex flex-wrap gap-4 text-sm text-[#5C5D6E]">
						<Link to="/catalog">Catalog</Link>
						{canDiscount ? <Link to="/admin/discount-tiers">Discounts</Link> : null}
						{user?.role === "ADMIN" ? <><Link to="/admin/warehouses">Warehouses</Link><Link to="/admin/subscription-plans">Subscriptions</Link></> : null}
					</nav>
				</div>
			</header>
			<Outlet />
		</div>
	);
};

export default AdminShell;
