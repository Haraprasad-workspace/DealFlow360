import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/client";
import useCurrentUser from "../hooks/useCurrentUser";

const emptyProduct = {
	name: "", sku: "", category: "", description: "", price: "", costPrice: "",
	unit: "piece", taxRate: 18, isRecurring: false, recurringCycle: "MONTHLY",
	quantityOnHand: 0, variants: [], priceLists: [], isActive: true,
};

const ProductCatalogPage = () => {
	const { user } = useCurrentUser();
	const isAdmin = user?.role === "ADMIN";
	const [products, setProducts] = useState([]);
	const [search, setSearch] = useState("");
	const [form, setForm] = useState(emptyProduct);
	const [showForm, setShowForm] = useState(false);
	const [error, setError] = useState("");
	const load = () => apiClient.get(isAdmin ? "/api/internal/admin/products" : "/api/products", { params: search ? { search } : {} })
		.then(({ data }) => setProducts(isAdmin ? data : data.products || []))
		.catch(() => setError("Unable to load the product catalog."));
	useEffect(() => { load(); }, [isAdmin, search]);
	const active = useMemo(() => products.filter((item) => item.isActive).length, [products]);
	const archived = products.length - active;
	const variantCount = products.reduce((total, item) => total + (item.variants?.length || 0), 0);
	const submit = async (event) => {
		event.preventDefault();
		try {
			const { data } = await apiClient.post("/api/internal/admin/products", {
				...form,
				price: Number(form.price),
				costPrice: Number(form.costPrice),
				taxRate: Number(form.taxRate),
				quantityOnHand: Number(form.quantityOnHand),
			});
			setProducts((current) => [data, ...current]);
			setForm(emptyProduct);
			setShowForm(false);
		} catch (submitError) {
			setError(submitError.response?.data?.message || "Unable to create product.");
		}
	};
	const toggleActive = async (product) => {
		const { data } = await apiClient.put(`/api/internal/admin/products/${product._id}`, { isActive: !product.isActive });
		setProducts((current) => current.map((item) => item._id === product._id ? data : item));
	};
	return (
		<main className="mx-auto max-w-7xl px-6 py-8">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div><h1 className="text-2xl font-bold">Product catalog</h1><p className="mt-1 text-sm text-[#5C5D6E]">Manage products, variants, inventory, taxes, and price lists.</p></div>
				<div className="flex gap-3"><input className="rounded-lg border border-[#D6D7E4] bg-white px-3 py-2 text-sm" placeholder="Search products" value={search} onChange={(event) => setSearch(event.target.value)} />{isAdmin ? <button className="rounded-lg bg-[#5B4CF5] px-4 py-2 text-sm text-white" onClick={() => setShowForm(!showForm)}>New product</button> : null}</div>
			</div>
			<div className="mt-6 grid gap-4 md:grid-cols-4">{[["Total products", products.length], ["Active", active], ["Archived", archived], ["Variants / SKUs", variantCount]].map(([label, value]) => <div key={label} className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-[#5C5D6E]">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div>)}</div>
			{showForm ? <form onSubmit={submit} className="mt-6 grid gap-3 rounded-2xl bg-white p-5 md:grid-cols-4">
				{[["name", "Name"], ["sku", "SKU"], ["category", "Category"], ["description", "Description"], ["price", "Base price"], ["costPrice", "Cost price"], ["unit", "Unit"], ["taxRate", "Tax %"], ["quantityOnHand", "Quantity on hand"]].map(([field, label]) => <input key={field} required={["name", "category", "price", "costPrice", "unit", "taxRate"].includes(field)} type={["price", "costPrice", "taxRate", "quantityOnHand"].includes(field) ? "number" : "text"} className="rounded-lg border p-2" placeholder={label} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} />)}
				<label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isRecurring} onChange={(event) => setForm({ ...form, isRecurring: event.target.checked })} /> Subscription eligible</label>{form.isRecurring ? <select className="rounded-lg border p-2" value={form.recurringCycle} onChange={(event) => setForm({ ...form, recurringCycle: event.target.value })}><option>WEEKLY</option><option>MONTHLY</option><option>YEARLY</option></select> : null}<button className="rounded-lg bg-[#5B4CF5] px-4 py-2 text-white">Create product</button>
			</form> : null}
			{error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
			<div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm"><table className="w-full text-left text-sm"><thead className="border-b text-[#5C5D6E]"><tr>{["Name", "Category", "Variants", "Price", "Unit", "Tax", "Status", ""].map((heading) => <th key={heading} className="p-4">{heading}</th>)}</tr></thead><tbody>{products.map((product) => <tr key={product._id} className="border-b last:border-0"><td className="p-4"><Link className="font-semibold text-[#5B4CF5]" to={`/catalog/${product._id}`}>{product.name}</Link><div className="text-xs text-[#5C5D6E]">{product.sku || "No SKU"}</div></td><td>{product.category}</td><td>{product.variants?.length || 0}</td><td>₹{product.price.toLocaleString("en-IN")}</td><td>{product.unit}</td><td>{product.taxRate}%</td><td><span className={product.isActive ? "text-green-600" : "text-[#5C5D6E]"}>{product.isActive ? "Active" : "Archived"}</span></td><td>{isAdmin ? <button className="text-[#5B4CF5]" onClick={() => toggleActive(product)}>{product.isActive ? "Archive" : "Reactivate"}</button> : null}</td></tr>)}</tbody></table></div>
		</main>
	);
};

export default ProductCatalogPage;
