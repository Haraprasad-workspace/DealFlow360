import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/client";

const AdminDashboard = () => {
	const [counts, setCounts] = useState({ products: 0, warehouses: 0, plans: 0, approvals: 0 });
	const [error, setError] = useState("");

	useEffect(() => {
		Promise.all([
			apiClient.get("/api/internal/admin/products", { params: { isActive: true } }),
			apiClient.get("/api/internal/admin/warehouses", { params: { isActive: true } }),
			apiClient.get("/api/internal/admin/subscriptionPlans", { params: { isActive: true } }),
			apiClient.get("/api/manager/approvals"),
		]).then(([products, warehouses, plans, approvals]) => {
			setCounts({
				products: products.data.length,
				warehouses: warehouses.data.length,
				plans: plans.data.length,
				approvals: approvals.data?.quotations?.length ?? approvals.data?.length ?? 0,
			});
		}).catch((loadError) => setError(loadError.response?.data?.message || "Unable to load Admin summary."));
	}, []);

	return (
		<main className="mx-auto max-w-7xl px-6 py-8">
			<p className="text-sm uppercase tracking-wide text-[#5C5D6E]">Administration</p>
			<h1 className="mt-1 text-3xl font-bold">Admin dashboard</h1>
			<p className="mt-2 text-[#5C5D6E]">Manage the catalog, commercial rules, fulfillment, and plans.</p>
			{error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
			<div className="mt-8 grid gap-4 md:grid-cols-4">
				{[["Active products", counts.products], ["Active warehouses", counts.warehouses], ["Active plans", counts.plans], ["Pending approvals", counts.approvals]].map(([label, value]) => (
					<div className="rounded-2xl bg-white p-5 shadow-sm" key={label}><p className="text-sm text-[#5C5D6E]">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></div>
				))}
			</div>
			<div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{[
					["Catalog", "/catalog", "Products, variants, and price lists"],
					["Discount config", "/admin/discount-tiers", "Tiers and approval rules"],
					["Warehouses", "/admin/warehouses", "Stock and fulfillment locations"],
					["Subscription plans", "/admin/subscription-plans", "Recurring commercial plans"],
				].map(([label, path, description]) => <Link className="rounded-2xl border border-[#D6D7E4] bg-white p-5 hover:border-[#5B4CF5]" to={path} key={path}><h2 className="font-semibold">{label}</h2><p className="mt-2 text-sm text-[#5C5D6E]">{description}</p><span className="mt-4 inline-block text-sm text-[#5B4CF5]">Open →</span></Link>)}
			</div>
		</main>
	);
};

export default AdminDashboard;
