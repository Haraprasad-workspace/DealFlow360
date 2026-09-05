import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "../api/client";

const CustomerDashboardPage = () => {
	const [data, setData] = useState({ quotations: [], orders: [] });
	const [error, setError] = useState("");

	useEffect(() => {
		Promise.all([apiClient.get("/api/portal/quotations?limit=5"), apiClient.get("/api/portal/orders?limit=5")])
			.then(([quotations, orders]) => setData({ quotations: quotations.data.quotations || [], orders: orders.data.orders || [] }))
			.catch(() => setError("Unable to load your portal data."));
	}, []);

	return (
		<main className="mx-auto max-w-6xl px-6 py-8">
			<h1 className="text-2xl font-bold">Customer portal</h1>
			<p className="mt-1 text-sm text-[#5C5D6E]">Review your quotations and orders.</p>
			{error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
			<div className="mt-6 grid gap-4 md:grid-cols-2">
				{[["Quotations", data.quotations, "/portal/quotations", "quotationNumber"], ["Orders", data.orders, "/portal/orders", "orderNumber"]].map(([title, items, path, numberKey]) => (
					<section key={title} className="rounded-2xl bg-white p-5 shadow-sm">
						<div className="flex items-center justify-between"><h2 className="font-semibold">{title}</h2><Link className="text-sm text-[#5B4CF5]" to={path}>View all</Link></div>
						{items.length ? items.map((item) => <Link key={item._id} to={`${path}/${item._id}`} className="mt-4 block border-t pt-3 text-sm"><span className="font-medium">{item[numberKey]}</span><span className="ml-3 text-[#5C5D6E]">{item.status}</span></Link>) : <p className="mt-4 text-sm text-[#5C5D6E]">No {title.toLowerCase()} yet.</p>}
					</section>
				))}
			</div>
		</main>
	);
};

export default CustomerDashboardPage;
