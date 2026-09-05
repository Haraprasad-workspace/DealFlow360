import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "../api/client";

const config = {
	quotations: { label: "Quotations", number: "quotationNumber" },
	orders: { label: "Orders", number: "orderNumber" },
};

const PortalListPage = () => {
	const { resource } = useParams();
	const current = config[resource] || config.quotations;
	const [items, setItems] = useState([]);
	const [error, setError] = useState("");
	useEffect(() => {
		apiClient.get(`/api/portal/${resource}`).then(({ data }) => setItems(data[resource] || [])).catch(() => setError(`Unable to load ${current.label.toLowerCase()}.`));
	}, [resource, current.label]);
	return <main className="mx-auto max-w-6xl px-6 py-8"><div className="flex items-end justify-between"><div><Link className="text-sm text-[#5B4CF5]" to="/portal">← Portal</Link><h1 className="mt-2 text-2xl font-bold">{current.label}</h1></div></div>{error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}<div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm"><table className="w-full text-left text-sm"><thead className="border-b text-[#5C5D6E]"><tr><th className="p-4">Number</th><th className="p-4">Status</th><th className="p-4">Created</th></tr></thead><tbody>{items.map((item) => <tr key={item._id} className="border-b last:border-0"><td className="p-4"><Link className="font-semibold text-[#5B4CF5]" to={`/portal/${resource}/${item._id}`}>{item[current.number]}</Link></td><td className="p-4">{item.status}</td><td className="p-4">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}</td></tr>)}</tbody></table>{!items.length && !error ? <p className="p-6 text-sm text-[#5C5D6E]">No {current.label.toLowerCase()} found.</p> : null}</div></main>;
};

export default PortalListPage;
