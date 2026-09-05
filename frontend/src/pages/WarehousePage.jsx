import { useEffect, useMemo, useState } from "react";
import apiClient from "../api/client";

const emptyWarehouse = {
	name: "",
	code: "",
	capacity: "",
	shippingCostWeight: 1,
	address: { city: "", state: "", country: "", pincode: "" },
	stock: [],
	isActive: true,
};

const WarehousePage = () => {
	const [warehouses, setWarehouses] = useState([]);
	const [products, setProducts] = useState([]);
	const [form, setForm] = useState(emptyWarehouse);
	const [stockEdits, setStockEdits] = useState({});
	const [showForm, setShowForm] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");

	const productMap = useMemo(
		() => new Map(products.map((product) => [String(product._id), product])),
		[products],
	);

	const load = async () => {
		setLoading(true);
		setError("");
		try {
			const [{ data: warehouseData }, { data: productData }] = await Promise.all([
				apiClient.get("/api/internal/admin/warehouses"),
				apiClient.get("/api/internal/admin/products"),
			]);
			setWarehouses(warehouseData);
			setProducts(productData);
			setStockEdits(
				Object.fromEntries(
					warehouseData.map((warehouse) => [
						warehouse._id,
						Object.fromEntries(
							(warehouse.stock || []).map((entry) => [String(entry.product?._id || entry.product), entry.quantityOnHand]),
						),
					]),
				),
			);
		} catch (loadError) {
			setError(loadError.response?.data?.message || "Unable to load warehouse data.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		load();
	}, []);

	const updateStock = async (warehouse) => {
		setError("");
		setMessage("");
		try {
			const stock = (warehouse.stock || []).map((entry) => ({
				product: entry.product?._id || entry.product,
				quantityOnHand: Number(stockEdits[warehouse._id]?.[String(entry.product?._id || entry.product)] ?? entry.quantityOnHand),
				reorderThreshold: entry.reorderThreshold,
				reorderQuantity: entry.reorderQuantity,
			}));
			const { data } = await apiClient.put(`/api/internal/admin/warehouses/${warehouse._id}`, { stock });
			setWarehouses((current) => current.map((item) => item._id === data._id ? data : item));
			setMessage(`Stock updated for ${warehouse.name}.`);
		} catch (saveError) {
			setError(saveError.response?.data?.message || "Unable to update stock.");
		}
	};

	const createWarehouse = async (event) => {
		event.preventDefault();
		setError("");
		try {
			const { data } = await apiClient.post("/api/internal/admin/warehouses", {
				...form,
				capacity: Number(form.capacity),
				shippingCostWeight: Number(form.shippingCostWeight),
			});
			setWarehouses((current) => [data, ...current]);
			setForm(emptyWarehouse);
			setShowForm(false);
		} catch (saveError) {
			setError(saveError.response?.data?.message || "Unable to create warehouse.");
		}
	};

	if (loading) return <main className="mx-auto max-w-7xl px-6 py-8">Loading warehouses...</main>;

	return (
		<main className="mx-auto max-w-7xl px-6 py-8">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<p className="text-sm uppercase tracking-wide text-[#5C5D6E]">Operations</p>
					<h1 className="text-2xl font-bold">Warehouse management</h1>
					<p className="mt-1 text-sm text-[#5C5D6E]">Manage locations, capacity, and product stock.</p>
				</div>
				<button className="rounded-lg bg-[#5B4CF5] px-4 py-2 text-sm text-white" onClick={() => setShowForm((current) => !current)}>
					{showForm ? "Cancel" : "Add warehouse"}
				</button>
			</div>
			{error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
			{message ? <p className="mt-4 text-sm text-green-600">{message}</p> : null}
			{showForm ? (
				<form onSubmit={createWarehouse} className="mt-6 grid gap-3 rounded-2xl bg-white p-5 md:grid-cols-4">
					<input className="rounded-lg border p-2" required placeholder="Warehouse name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
					<input className="rounded-lg border p-2" required placeholder="Code" value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} />
					<input className="rounded-lg border p-2" required type="number" placeholder="Capacity" value={form.capacity} onChange={(event) => setForm({ ...form, capacity: event.target.value })} />
					<input className="rounded-lg border p-2" type="number" min="0" placeholder="Shipping cost weight" value={form.shippingCostWeight} onChange={(event) => setForm({ ...form, shippingCostWeight: event.target.value })} />
					<input className="rounded-lg border p-2" placeholder="City" value={form.address.city} onChange={(event) => setForm({ ...form, address: { ...form.address, city: event.target.value } })} />
					<input className="rounded-lg border p-2" placeholder="State" value={form.address.state} onChange={(event) => setForm({ ...form, address: { ...form.address, state: event.target.value } })} />
					<input className="rounded-lg border p-2" placeholder="Country" value={form.address.country} onChange={(event) => setForm({ ...form, address: { ...form.address, country: event.target.value } })} />
					<input className="rounded-lg border p-2" placeholder="Pincode" value={form.address.pincode} onChange={(event) => setForm({ ...form, address: { ...form.address, pincode: event.target.value } })} />
					<button className="rounded-lg bg-[#5B4CF5] px-4 py-2 text-white md:col-span-4">Save warehouse</button>
				</form>
			) : null}
			<div className="mt-6 grid gap-6">
				{warehouses.map((warehouse) => (
					<section className="rounded-2xl bg-white p-5 shadow-sm" key={warehouse._id}>
						<div className="flex flex-wrap items-start justify-between gap-3">
							<div>
								<h2 className="text-lg font-semibold">{warehouse.name}</h2>
								<p className="text-sm text-[#5C5D6E]">{warehouse.code} · {warehouse.address?.city || "No city"} · Capacity {warehouse.capacity}</p>
							</div>
							<button className="rounded-lg border border-[#5B4CF5] px-3 py-2 text-sm text-[#5B4CF5]" onClick={() => updateStock(warehouse)}>Save stock</button>
						</div>
						<div className="mt-4 overflow-x-auto">
							<table className="w-full text-left text-sm">
								<thead className="border-b text-[#5C5D6E]"><tr><th className="p-3">Product</th><th className="p-3">Quantity on hand</th><th className="p-3">Reorder threshold</th></tr></thead>
								<tbody>
									{(warehouse.stock || []).map((entry) => {
										const productId = String(entry.product?._id || entry.product);
										const product = productMap.get(productId);
										return (
											<tr className="border-b last:border-0" key={productId}>
												<td className="p-3">{product?.name || productId}</td>
												<td className="p-3"><input className="w-32 rounded-lg border p-2" type="number" min="0" value={stockEdits[warehouse._id]?.[productId] ?? entry.quantityOnHand} onChange={(event) => setStockEdits({ ...stockEdits, [warehouse._id]: { ...stockEdits[warehouse._id], [productId]: event.target.value } })} /></td>
												<td className="p-3">{entry.reorderThreshold ?? 0}</td>
											</tr>
										);
									})}
								</tbody>
							</table>
							{!warehouse.stock?.length ? <p className="p-3 text-sm text-[#5C5D6E]">No stock entries configured for this warehouse.</p> : null}
						</div>
					</section>
				))}
			</div>
		</main>
	);
};

export default WarehousePage;
