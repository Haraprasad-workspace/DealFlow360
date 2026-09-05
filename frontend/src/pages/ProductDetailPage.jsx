import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import apiClient from "../api/client";

const ProductDetailPage = () => {
	const { productId } = useParams();
	const [product, setProduct] = useState(null);
	const [error, setError] = useState("");
	useEffect(() => {
		apiClient.get(`/api/products/${productId}`).then(({ data }) => setProduct(data)).catch(() => setError("Unable to load this product."));
	}, [productId]);
	if (error) return <main className="mx-auto max-w-3xl px-6 py-10 text-red-600">{error}</main>;
	if (!product) return <main className="mx-auto max-w-3xl px-6 py-10 text-[#5C5D6E]">Loading product...</main>;
	return <main className="mx-auto max-w-3xl px-6 py-10"><Link className="text-sm text-[#5B4CF5]" to="/catalog">← Catalog</Link><section className="mt-5 rounded-2xl bg-white p-8 shadow-sm"><p className="text-sm text-[#5C5D6E]">{product.category}{product.sku ? ` · ${product.sku}` : ""}</p><h1 className="mt-2 text-3xl font-bold">{product.name}</h1><p className="mt-4 text-[#5C5D6E]">{product.description || "No description available."}</p><p className="mt-6 text-2xl font-bold">₹{product.price.toLocaleString("en-IN")}</p><p className="mt-2 text-sm text-[#5C5D6E]">Tax: {product.taxRate}% · Sold per {product.unit}</p>{product.variants?.length ? <div className="mt-6"><h2 className="font-semibold">Options</h2>{product.variants.map((variant) => <p key={variant.attribute} className="mt-2 text-sm">{variant.attribute}: {variant.values.join(", ")}</p>)}</div> : null}</section></main>;
};

export default ProductDetailPage;
