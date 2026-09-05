import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import apiClient from "../api/client";
import useCurrentUser from "../hooks/useCurrentUser";

const ProductDetailPage = () => {
	const { productId } = useParams();
	const { user } = useCurrentUser();
	const isAdmin = user?.role === "ADMIN";
	const [product, setProduct] = useState(null);
	const [error, setError] = useState("");
	const [variant, setVariant] = useState({ attribute: "", values: "", extraPrice: 0 });
	const [priceList, setPriceList] = useState({ tier: "BRONZE", currency: "INR", price: "" });
	useEffect(() => {
		apiClient.get(`${isAdmin ? "/api/internal/admin/products" : "/api/products"}/${productId}`).then(({ data }) => setProduct(data)).catch(() => setError("Unable to load this product."));
	}, [productId, isAdmin]);
	const save = async (changes) => {
		try {
			const { data } = await apiClient.put(`/api/internal/admin/products/${productId}`, changes);
			setProduct(data);
		} catch (saveError) {
			setError(saveError.response?.data?.message || "Unable to save product.");
		}
	};
	if (error) return <main className="mx-auto max-w-3xl px-6 py-10 text-red-600">{error}</main>;
	if (!product) return <main className="mx-auto max-w-3xl px-6 py-10 text-[#5C5D6E]">Loading product...</main>;
	return <main className="mx-auto max-w-5xl px-6 py-8"><Link className="text-sm text-[#5B4CF5]" to="/catalog">← Catalog</Link><section className="mt-5 rounded-2xl bg-white p-8 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-sm text-[#5C5D6E]">{product.category} · {product.sku || "No SKU"}</p><h1 className="mt-2 text-3xl font-bold">{product.name}</h1><p className="mt-4 text-[#5C5D6E]">{product.description || "No description available."}</p></div><span className={product.isActive ? "text-green-600" : "text-[#5C5D6E]"}>{product.isActive ? "Active" : "Archived"}</span></div><div className="mt-6 grid gap-4 md:grid-cols-4"><div><p className="text-sm text-[#5C5D6E]">Base price</p><p className="text-xl font-bold">₹{product.price.toLocaleString("en-IN")}</p></div><div><p className="text-sm text-[#5C5D6E]">Tax</p><p className="text-xl font-bold">{product.taxRate}%</p></div><div><p className="text-sm text-[#5C5D6E]">On hand</p><p className="text-xl font-bold">{product.quantityOnHand || 0}</p></div><div><p className="text-sm text-[#5C5D6E]">Recurring</p><p className="text-xl font-bold">{product.isRecurring ? product.recurringCycle : "No"}</p></div></div>{isAdmin ? <><div className="mt-8 border-t pt-6"><h2 className="font-semibold">Manage variants</h2><div className="mt-3 flex flex-wrap gap-2"><input className="rounded-lg border p-2" placeholder="Attribute (RAM)" value={variant.attribute} onChange={(event) => setVariant({ ...variant, attribute: event.target.value })} /><input className="rounded-lg border p-2" placeholder="Values: 16GB,32GB" value={variant.values} onChange={(event) => setVariant({ ...variant, values: event.target.value })} /><input className="w-28 rounded-lg border p-2" type="number" placeholder="Extra price" value={variant.extraPrice} onChange={(event) => setVariant({ ...variant, extraPrice: Number(event.target.value) })} /><button className="rounded-lg bg-[#5B4CF5] px-3 py-2 text-sm text-white" onClick={() => { save({ variants: [...(product.variants || []), { ...variant, values: variant.values.split(",").map((value) => value.trim()).filter(Boolean) }] }); setVariant({ attribute: "", values: "", extraPrice: 0 }); }}>Add variant</button></div>{product.variants?.map((item) => <p className="mt-2 text-sm" key={item.attribute}><strong>{item.attribute}:</strong> {item.values.join(", ")} (+₹{item.extraPrice})</p>)}</div><div className="mt-8 border-t pt-6"><h2 className="font-semibold">Pricelists by tier and currency</h2><div className="mt-3 flex flex-wrap gap-2"><select className="rounded-lg border p-2" value={priceList.tier} onChange={(event) => setPriceList({ ...priceList, tier: event.target.value })}><option>BRONZE</option><option>SILVER</option><option>GOLD</option></select><select className="rounded-lg border p-2" value={priceList.currency} onChange={(event) => setPriceList({ ...priceList, currency: event.target.value })}><option>INR</option><option>USD</option><option>EUR</option></select><input className="w-32 rounded-lg border p-2" type="number" placeholder="Price" value={priceList.price} onChange={(event) => setPriceList({ ...priceList, price: Number(event.target.value) })} /><button className="rounded-lg bg-[#5B4CF5] px-3 py-2 text-sm text-white" onClick={() => save({ priceLists: [...(product.priceLists || []).filter((item) => !(item.tier === priceList.tier && item.currency === priceList.currency)), priceList] })}>Save price</button></div>{product.priceLists?.map((item) => <p className="mt-2 text-sm" key={`${item.tier}-${item.currency}`}>{item.tier} / {item.currency}: {item.price}</p>)}</div></> : null}</section></main>;
};

export default ProductDetailPage;
