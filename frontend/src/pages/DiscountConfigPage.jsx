import { useEffect, useState } from "react";
import apiClient from "../api/client";

const blank = { customerTier: "BRONZE", category: "", maxDiscount: "", approvalLevel: "MANAGER", isActive: true };
const defaultRules = [
	{ minDiscount: 0, maxDiscount: 5, approval: "NONE" },
	{ minDiscount: 5.01, maxDiscount: 15, approval: "MANAGER" },
	{ minDiscount: 15.01, maxDiscount: 100, approval: "MANAGER_FINANCE" },
];

const DiscountConfigPage = () => {
	const [items, setItems] = useState([]);
	const [form, setForm] = useState(blank);
	const [rules, setRules] = useState(defaultRules);
	const [editing, setEditing] = useState(null);
	const [version, setVersion] = useState(null);
	const [error, setError] = useState("");
	useEffect(() => {
		Promise.all([
			apiClient.get("/api/internal/admin/discountTiers"),
			apiClient.get("/api/internal/admin/approval-config"),
		]).then(([tiers, approval]) => {
			setItems(tiers.data);
			if (approval.data) { setRules(approval.data.rules); setVersion(approval.data.version); }
		}).catch(() => setError("Unable to load discount configuration."));
	}, []);
	const submit = async (event) => {
		event.preventDefault();
		try {
			const path = `/api/internal/admin/discountTiers${editing ? `/${editing}` : ""}`;
			const response = editing ? await apiClient.put(path, form) : await apiClient.post(path, form);
			setItems((current) => editing ? current.map((item) => item._id === editing ? response.data : item) : [response.data, ...current]);
			setForm(blank); setEditing(null);
		} catch (submitError) { setError(submitError.response?.data?.message || "Unable to save discount configuration."); }
	};
	const saveApproval = async () => {
		try {
			const { data } = await apiClient.post("/api/internal/admin/approval-config", { rules });
			setVersion(data.version);
		} catch (saveError) { setError(saveError.response?.data?.message || "Unable to save approval chain."); }
	};
	const remove = async (id) => { await apiClient.delete(`/api/internal/admin/discountTiers/${id}`); setItems((current) => current.filter((item) => item._id !== id)); };
	return <main className="mx-auto max-w-6xl px-6 py-8"><h1 className="text-2xl font-bold">Discount tiers & approval chain</h1><p className="mt-1 text-sm text-[#5C5D6E]">Configure independent tier/category ceilings and the approval workflow used downstream.</p>{error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}<form onSubmit={submit} className="mt-6 grid gap-3 rounded-2xl bg-white p-5 md:grid-cols-5"><select className="rounded-lg border p-2" value={form.customerTier} onChange={(e) => setForm({ ...form, customerTier: e.target.value })}><option>BRONZE</option><option>SILVER</option><option>GOLD</option></select><input required className="rounded-lg border p-2" placeholder="Category ceiling" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /><input required type="number" min="0" max="100" className="rounded-lg border p-2" placeholder="Max %" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })} /><select className="rounded-lg border p-2" value={form.approvalLevel} onChange={(e) => setForm({ ...form, approvalLevel: e.target.value })}><option>NONE</option><option>MANAGER</option><option>FINANCE</option></select><button className="rounded-lg bg-[#5B4CF5] px-4 py-2 text-white">{editing ? "Update ceiling" : "Add ceiling"}</button></form><div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm"><table className="w-full text-left text-sm"><thead className="border-b text-[#5C5D6E]"><tr><th className="p-4">Tier</th><th>Category</th><th>Maximum</th><th>Approval</th><th /></tr></thead><tbody>{items.map((item) => <tr key={item._id} className="border-b last:border-0"><td className="p-4">{item.customerTier}</td><td>{item.category}</td><td>{item.maxDiscount}%</td><td>{item.approvalLevel}</td><td className="pr-4 text-right"><button className="mr-3 text-[#5B4CF5]" onClick={() => { setEditing(item._id); setForm(item); }}>Edit</button><button className="text-red-600" onClick={() => remove(item._id)}>Delete</button></td></tr>)}</tbody></table></div><section className="mt-6 rounded-2xl bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Approval chain</h2><p className="text-sm text-[#5C5D6E]">Version {version || "draft"} · saved as an immutable configuration revision</p></div><button className="rounded-lg bg-[#5B4CF5] px-4 py-2 text-sm text-white" onClick={saveApproval}>Save configuration</button></div>{rules.map((rule, index) => <div className="mt-3 grid gap-2 md:grid-cols-3" key={`${rule.minDiscount}-${index}`}><input type="number" min="0" max="100" className="rounded-lg border p-2" value={rule.minDiscount} onChange={(e) => setRules(rules.map((item, i) => i === index ? { ...item, minDiscount: Number(e.target.value) } : item))} /><input type="number" min="0" max="100" className="rounded-lg border p-2" value={rule.maxDiscount} onChange={(e) => setRules(rules.map((item, i) => i === index ? { ...item, maxDiscount: Number(e.target.value) } : item))} /><select className="rounded-lg border p-2" value={rule.approval} onChange={(e) => setRules(rules.map((item, i) => i === index ? { ...item, approval: e.target.value } : item))}><option value="NONE">No approval</option><option value="MANAGER">Sales Manager</option><option value="MANAGER_FINANCE">Sales Manager then Finance</option></select></div>)}</section></main>;
};

export default DiscountConfigPage;
