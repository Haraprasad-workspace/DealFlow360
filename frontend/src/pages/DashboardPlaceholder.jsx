import { Link } from "react-router-dom";
import useCurrentUser from "../hooks/useCurrentUser";

const DashboardPlaceholder = () => {
	const { user } = useCurrentUser();
	const canDiscount =
		user?.role === "ADMIN" ||
		user?.permissions?.canConfigure?.includes("discountTiers");
	const isAdmin = user?.role === "ADMIN";
	const modules = [
		{
			title: "Product catalog",
			description: "Browse products, pricing, variants, and recurring services.",
			to: "/catalog",
			visible: true,
		},
		{
			title: "Discount configuration",
			description: "Manage customer tier limits and approval requirements.",
			to: "/admin/discount-tiers",
			visible: canDiscount,
		},
		{
			title: "Warehouses",
			description: "Maintain warehouse locations, codes, and capacities.",
			to: "/admin/warehouses",
			visible: isAdmin,
		},
		{
			title: "Subscription plans",
			description: "Manage active subscription plans and billing intervals.",
			to: "/admin/subscription-plans",
			visible: isAdmin,
		},
	].filter((module) => module.visible);

	return (
		<div className="min-h-screen bg-[#FAFAFC] px-6 py-10 font-['Inter',sans-serif] text-[#1A1B25]">
			<div className="mx-auto max-w-5xl">
				<div className="rounded-2xl bg-white p-8 shadow-[0_1px_2px_rgba(30,26,80,0.04),0_2px_8px_rgba(30,26,80,0.06)]">
				<h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold">
					Sales Dashboard
				</h1>
				<p className="mt-2 text-sm text-[#5C5D6E]">
					Manage your sales and configuration workspace from the modules below.
				</p>
				{user ? (
					<p className="mt-6 text-sm">
						Signed in as <strong>{user.name}</strong> ({user.role})
					</p>
				) : null}
				</div>
				<div className="mt-6 grid gap-4 md:grid-cols-2">
					{modules.map((module) => (
						<Link
							key={module.to}
							to={module.to}
							className="rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(30,26,80,0.04),0_2px_8px_rgba(30,26,80,0.06)] transition hover:-translate-y-0.5"
						>
							<h2 className="font-semibold">{module.title}</h2>
							<p className="mt-2 text-sm text-[#5C5D6E]">
								{module.description}
							</p>
							<span className="mt-5 inline-block text-sm font-medium text-[#5B4CF5]">
								Open module →
							</span>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default DashboardPlaceholder;
