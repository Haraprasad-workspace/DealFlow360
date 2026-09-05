import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/client";

const ProductCatalogPage = () => {
	const [products, setProducts] = useState([]);
	const [search, setSearch] = useState("");
	const [error, setError] = useState("");
	useEffect(() => {
		apiClient.get("/api/products", { params: search ? { search } : {} })
			.then(({ data }) => setProducts(data.products || []))
			.catch(() => setError("Unable to load the product catalog."));
	}, [search]);
	return (
		<main className="mx-auto max-w-7xl px-6 py-8">
			<div className="mb-6 flex items-center justify-between"><div><h1 className="text-2xl font-bold">Product catalog</h1><p className="mt-1 text-sm text-[#5C5D6E]">Browse active products and pricing.</p></div><input className="rounded-lg border border-[#D6D7E4] bg-white px-3 py-2 text-sm" placeholder="Search products" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
			{error ? <p className="text-sm text-red-600">{error}</p> : null}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{products.map((product) => <Link key={product._id} to={`/catalog/${product._id}`} className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5"><div className="flex justify-between"><h2 className="font-semibold">{product.name}</h2><span className="text-xs text-[#5C5D6E]">{product.category}</span></div><p className="mt-3 text-xl font-bold">₹{product.price.toLocaleString("en-IN")}</p><p className="mt-1 text-sm text-[#5C5D6E]">{product.unit}{product.isRecurring ? " · recurring" : ""}</p></Link>)}</div>
		</main>
	);
};

export default ProductCatalogPage;
