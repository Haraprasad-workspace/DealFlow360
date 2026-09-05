import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "../api/client";

const PortalDetailPage = () => {
	const { resource, id } = useParams();
	const [item, setItem] = useState(null);
	const [error, setError] = useState("");
	useEffect(() => {
		apiClient.get(`/api/portal/${resource}/${id}`).then(({ data }) => setItem(data)).catch(() => setError("Unable to load this record."));
	}, [resource, id]);
	if (error) return <main className="mx-auto max-w-4xl px-6 py-8"><Link className="text-sm text-[#5B4CF5]" to={`/portal/${resource}`}>← Back</Link><p className="mt-6 text-sm text-red-600">{error}</p></main>;
	if (!item) return <main className="mx-auto max-w-4xl px-6 py-8 text-sm text-[#5C5D6E]">Loading...</main>;
	const number = item.quotationNumber || item.orderNumber;
	return <main className="mx-auto max-w-4xl px-6 py-8"><Link className="text-sm text-[#5B4CF5]" to={`/portal/${resource}`}>← Back to {resource}</Link><div className="mt-4 rounded-2xl bg-white p-6 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-bold">{number}</h1><p className="mt-1 text-sm text-[#5C5D6E]">Created {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}</p></div><span className="rounded-full bg-[#F0EEFF] px-3 py-1 text-sm text-[#5B4CF5]">{item.status}</span></div><div className="mt-6 grid gap-3 sm:grid-cols-3"><div><p className="text-xs text-[#5C5D6E]">Subtotal</p><p className="font-semibold">₹{(item.subtotal || 0).toLocaleString("en-IN")}</p></div><div><p className="text-xs text-[#5C5D6E]">Tax</p><p className="font-semibold">₹{(item.taxTotal || 0).toLocaleString("en-IN")}</p></div><div><p className="text-xs text-[#5C5D6E]">Total</p><p className="font-semibold">₹{(item.grandTotal || 0).toLocaleString("en-IN")}</p></div></div><h2 className="mt-8 font-semibold">Items</h2><div className="mt-3 divide-y">{(item.items || []).map((line, index) => <div key={line._id || index} className="flex justify-between py-3 text-sm"><span>{line.product?.name || "Product"} × {line.quantity}</span><span>₹{(line.total || 0).toLocaleString("en-IN")}</span></div>)}</div></div></main>;
};

export default PortalDetailPage;
