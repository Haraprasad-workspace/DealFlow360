import { useCallback, useEffect, useState } from "react";
import apiClient from "../api/client";

const configs = {
	warehouses: { title: "Warehouses", fields: [["name", "Name"], ["code", "Code"], ["capacity", "Capacity"]], blank: { name: "", code: "", capacity: "", isActive: true } },
	subscriptionPlans: { title: "Subscription plans", fields: [["name", "Name"], ["price", "Price"]], blank: { name: "", billingInterval: "MONTHLY", price: "", description: "", isActive: true } },
};
const AdminResourcePage = ({ resource }) => {
	const config = configs[resource];
	const [items, setItems] = useState([]);
	const [form, setForm] = useState(config.blank);
	const [editing, setEditing] = useState(null);
	const [error, setError] = useState("");
	const load = useCallback(() => apiClient.get(`/api/internal/admin/${resource}`).then(({ data }) => setItems(data)).catch(() => setError(`Unable to load ${config.title.toLowerCase()}.`)), [config, resource]);
	useEffect(() => { load(); }, [load]);
	const submit = async (event) => { event.preventDefault(); try { const path = `/api/internal/admin/${resource}${editing ? `/${editing}` : ""}`; const response = editing ? await apiClient.put(path, form) : await apiClient.post(path, form); setItems((current) => editing ? current.map((item) => item._id === editing ? response.data : item) : [response.data, ...current]); setForm(config.blank); setEditing(null); } catch (submitError) { setError(submitError.response?.data?.message || "Unable to save."); } };
	const remove = async (id) => { await apiClient.delete(`/api/internal/admin/${resource}/${id}`); setItems((current) => current.filter((item) => item._id !== id)); };
	return <main className="mx-auto max-w-6xl px-6 py-8"><h1 className="text-2xl font-bold">{config.title}</h1>{error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}<form onSubmit={submit} className="mt-6 flex flex-wrap gap-3 rounded-2xl bg-white p-5">{config.fields.map(([field, label]) => <input key={field} required className="rounded-lg border p-2" type={field === "price" || field === "capacity" ? "number" : "text"} placeholder={label} value={form[field]} onChange={(e) => setForm({ ...form, [field]: field === "price" || field === "capacity" ? Number(e.target.value) : e.target.value })} />)}{resource === "subscriptionPlans" ? <select className="rounded-lg border p-2" value={form.billingInterval} onChange={(e) => setForm({ ...form, billingInterval: e.target.value })}><option>MONTHLY</option><option>YEARLY</option></select> : null}<button className="rounded-lg bg-[#5B4CF5] px-4 py-2 text-white">{editing ? "Update" : "Add"}</button></form><div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm"><table className="w-full text-left text-sm"><tbody>{items.map((item) => <tr key={item._id} className="border-b last:border-0"><td className="p-4 font-medium">{item.name}</td><td>{resource === "warehouses" ? `${item.code} · capacity ${item.capacity}` : `₹${item.price} · ${item.billingInterval}`}</td><td className="pr-4 text-right"><button className="mr-3 text-[#5B4CF5]" onClick={() => { setEditing(item._id); setForm(item); }}>Edit</button><button className="text-red-600" onClick={() => remove(item._id)}>Delete</button></td></tr>)}</tbody></table></div></main>;
};

export default AdminResourcePage;
