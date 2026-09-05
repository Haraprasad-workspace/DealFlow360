import { useCallback, useEffect, useState } from "react";
import apiClient from "../api/client";

const configs = {
	warehouses: {
		title: "Warehouses & fulfillment",
		fields: [["name", "Name"], ["code", "Code"], ["capacity", "Capacity"], ["shippingCostWeight", "Shipping weight"]],
		blank: { name: "", code: "", capacity: "", shippingCostWeight: 1, address: { city: "", state: "", country: "" }, stock: [], isActive: true },
	},
	subscriptionPlans: {
		title: "Subscription plans",
		fields: [["name", "Name"], ["price", "Price"], ["description", "Description"]],
		blank: { name: "", billingInterval: "MONTHLY", price: "", description: "", products: [], prorationRule: "PRO_RATA", cancellationRule: "END_OF_TERM", partialRefundRule: "REMAINING_DAYS", isActive: true },
	},
};

const AdminResourcePage = ({ resource }) => {
	const config = configs[resource];
	const [items, setItems] = useState([]);
	const [form, setForm] = useState(config.blank);
	const [editing, setEditing] = useState(null);
	const [error, setError] = useState("");
	const load = useCallback(() => apiClient.get(`/api/internal/admin/${resource}`).then(({ data }) => setItems(data)).catch(() => setError(`Unable to load ${config.title.toLowerCase()}.`)), [config, resource]);
	useEffect(() => { load(); }, [load]);
	const submit = async (event) => {
		event.preventDefault();
		try {
			const path = `/api/internal/admin/${resource}${editing ? `/${editing}` : ""}`;
			const payload = { ...form, price: form.price === "" ? undefined : Number(form.price), capacity: form.capacity === "" ? undefined : Number(form.capacity), shippingCostWeight: Number(form.shippingCostWeight) };
			const { data } = editing ? await apiClient.put(path, payload) : await apiClient.post(path, payload);
			setItems((current) => editing ? current.map((item) => item._id === editing ? data : item) : [data, ...current]);
			setForm(config.blank); setEditing(null);
		} catch (submitError) { setError(submitError.response?.data?.message || "Unable to save."); }
	};
	const remove = async (id) => { await apiClient.delete(`/api/internal/admin/${resource}/${id}`); setItems((current) => current.filter((item) => item._id !== id)); };
	const setField = (field, value) => setForm({ ...form, [field]: value });
	return <main className="mx-auto max-w-6xl px-6 py-8"><h1 className="text-2xl font-bold">{config.title}</h1><p className="mt-1 text-sm text-[#5C5D6E]">{resource === "warehouses" ? "Configure stock levels, replenishment rules, and shipping-cost weighting." : "Define recurring cadence, attached products, proration, cancellation, and refund rules."}</p>{error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}<form onSubmit={submit} className="mt-6 grid gap-3 rounded-2xl bg-white p-5 md:grid-cols-4">{config.fields.map(([field, label]) => <input key={field} required={["name", "code", "capacity", "price"].includes(field)} className="rounded-lg border p-2" type={["price", "capacity", "shippingCostWeight"].includes(field) ? "number" : "text"} placeholder={label} value={form[field]} onChange={(e) => setField(field, ["price", "capacity", "shippingCostWeight"].includes(field) ? e.target.value : e.target.value)} />)}{resource === "warehouses" ? <><input className="rounded-lg border p-2" placeholder="City" value={form.address.city} onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })} /><input className="rounded-lg border p-2" placeholder="State" value={form.address.state} onChange={(e) => setForm({ ...form, address: { ...form.address, state: e.target.value } })} /></> : <><select className="rounded-lg border p-2" value={form.billingInterval} onChange={(e) => setField("billingInterval", e.target.value)}><option>MONTHLY</option><option>QUARTERLY</option><option>YEARLY</option></select><select className="rounded-lg border p-2" value={form.prorationRule} onChange={(e) => setField("prorationRule", e.target.value)}><option value="PRO_RATA">Pro-rata proration</option><option value="NONE">No proration</option></select><select className="rounded-lg border p-2" value={form.cancellationRule} onChange={(e) => setField("cancellationRule", e.target.value)}><option value="END_OF_TERM">Cancel at term end</option><option value="IMMEDIATE">Cancel immediately</option></select><select className="rounded-lg border p-2" value={form.partialRefundRule} onChange={(e) => setField("partialRefundRule", e.target.value)}><option value="REMAINING_DAYS">Refund remaining days</option><option value="NONE">No partial refund</option></select></>}<button className="rounded-lg bg-[#5B4CF5] px-4 py-2 text-white">{editing ? "Update" : "Save"}</button></form><div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm"><table className="w-full text-left text-sm"><tbody>{items.map((item) => <tr key={item._id} className="border-b last:border-0"><td className="p-4 font-medium">{item.name}</td><td>{resource === "warehouses" ? `${item.code} · capacity ${item.capacity} · ${item.stock?.length || 0} stock rules` : `₹${item.price} · ${item.billingInterval} · ${item.products?.length || 0} products`}</td><td className="pr-4 text-right"><button className="mr-3 text-[#5B4CF5]" onClick={() => { setEditing(item._id); setForm(item); }}>Edit</button><button className="text-red-600" onClick={() => remove(item._id)}>Delete</button></td></tr>)}</tbody></table></div></main>;
};

export default AdminResourcePage;
