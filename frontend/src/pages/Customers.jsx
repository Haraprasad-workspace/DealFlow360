import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createCustomer, getCustomers } from "../api/salesRep";
import { Button, ErrorState, LoadingState, PageHeader } from "../components/WorkspaceUI";

const blank = { name: "", email: "", company: "", phone: "", tier: "BRONZE" };
const Customers = () => {
	const [result, setResult] = useState(null); const [query, setQuery] = useState(""); const [tier, setTier] = useState(""); const [form, setForm] = useState(blank); const [open, setOpen] = useState(false); const [error, setError] = useState(null); const [saving, setSaving] = useState(false);
	const load = useCallback(async () => {
		console.info("[customers] loading list", { query, tier });
		setError(null);
		try {
			const response = await getCustomers({ search: query || undefined, tier: tier || undefined, limit: 50 });
			console.info("[customers] loaded", { count: response.data?.customers?.length || 0 });
			setResult(response.data);
		} catch (loadError) {
			console.error("[customers] load failed", loadError);
			setError(loadError);
		}
	}, [query, tier]);
	useEffect(() => { const timer = window.setTimeout(load, 0); return () => window.clearTimeout(timer); }, [load]);
	const submit = async (event) => { event.preventDefault(); setSaving(true); try { console.info("[customers] creating customer"); await createCustomer(form); console.info("[customers] create succeeded"); setForm(blank); setOpen(false); await load(); } catch (saveError) { console.error("[customers] create failed", saveError); setError(saveError); } finally { setSaving(false); } };
	return <><PageHeader eyebrow="Relationship book" title="Customers" description="Know the people behind every opportunity." action={<Button onClick={() => setOpen(true)}>+ Add customer</Button>} /><div className="toolbar"><input className="search-input" placeholder="Search name, company, or email" value={query} onChange={(event) => setQuery(event.target.value)} /><select value={tier} onChange={(event) => setTier(event.target.value)}><option value="">All tiers</option><option>BRONZE</option><option>SILVER</option><option>GOLD</option></select></div>{error && <ErrorState error={error} />}{!result && !error ? <LoadingState /> : <div className="table-panel"><div className="table-head"><span>Customer</span><span>Company</span><span>Tier</span><span>Added</span></div>{result?.customers?.map((customer) => <Link className="table-row" to={`/customers/${customer._id}`} key={customer._id}><div className="person-cell"><span className="avatar">{customer.name.slice(0, 1)}</span><div><strong>{customer.name}</strong><small>{customer.email}</small></div></div><span>{customer.company}</span><span className={`tier tier-${customer.tier.toLowerCase()}`}>{customer.tier}</span><span className="muted-copy">{new Date(customer.createdAt).toLocaleDateString("en-IN")}</span></Link>)}</div>}
	{open && <div className="modal-backdrop"><form className="modal" onSubmit={submit}><div className="modal-heading"><div><p className="eyebrow">New relationship</p><h2>Add customer</h2></div><button type="button" className="close-button" onClick={() => setOpen(false)}>×</button></div><label>Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label><label>Company<input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></label><label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label><label>Phone<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label><label>Tier<select value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })}><option>BRONZE</option><option>SILVER</option><option>GOLD</option></select></label><Button disabled={saving}>{saving ? "Saving..." : "Create customer"}</Button></form></div>}
	</>;
};
export default Customers;
