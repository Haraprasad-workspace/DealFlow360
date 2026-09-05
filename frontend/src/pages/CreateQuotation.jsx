import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { createQuotation, getCustomers, getProducts, getErrorMessage } from "../api/salesRep";
import { Button, ErrorState, LoadingState, Money, PageHeader } from "../components/WorkspaceUI";

const CreateQuotation = () => {
	const navigate = useNavigate();
	const [params] = useSearchParams();
	const initialProductId = params.get("productId");
	const [customers, setCustomers] = useState([]);
	const [products, setProducts] = useState([]);
	const [customerId, setCustomerId] = useState("");
	const [items, setItems] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		let active = true;
		const loadBuilderData = async () => {
			console.info("[quotation-builder] loading customers and products");
			setLoading(true);
			setError(null);
			try {
				const [customerResponse, productResponse] = await Promise.all([
					getCustomers({ limit: 100 }),
					getProducts({ limit: 100 }),
				]);
				if (!active) return;
				const loadedCustomers = customerResponse.data?.customers || [];
				const loadedProducts = productResponse.data?.products || [];
				console.info("[quotation-builder] data loaded", { customers: loadedCustomers.length, products: loadedProducts.length });
				setCustomers(loadedCustomers);
				setProducts(loadedProducts);
				if (initialProductId && loadedProducts.some((product) => product._id === initialProductId)) {
					setItems([{ productId: initialProductId, quantity: 1, discount: 0 }]);
				}
			} catch (loadError) {
				console.error("[quotation-builder] data load failed", loadError);
				if (active) setError(loadError);
			} finally {
				if (active) setLoading(false);
			}
		};
		void loadBuilderData();
		return () => { active = false; };
	}, [initialProductId]);

	const total = useMemo(() => items.reduce((sum, item) => {
		const product = products.find((currentProduct) => currentProduct._id === item.productId);
		return sum + (product?.price || 0) * Number(item.quantity || 0) * (1 - Number(item.discount || 0) / 100);
	}, 0), [items, products]);

	const addItem = () => setItems([...items, { productId: products[0]?._id || "", quantity: 1, discount: 0 }]);
	const updateItem = (index, key, value) => setItems(items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));

	const submit = async (event) => {
		event.preventDefault();
		setSaving(true);
		setError(null);
		try {
			console.info("[quotation-builder] creating quotation", { customerId, itemCount: items.length });
			const response = await createQuotation({ customerId, items: items.map(({ productId, quantity, discount }) => ({ productId, quantity: Number(quantity), discount: Number(discount) })) });
			console.info("[quotation-builder] quotation created", response.data?._id);
			navigate(`/quotations/${response.data._id}`, { replace: true });
		} catch (saveError) {
			console.error("[quotation-builder] create failed", saveError);
			setError(saveError);
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <LoadingState label="Loading quote builder" />;
	if (error && (!products.length || !customers.length)) return <ErrorState error={error} />;
	if (!products.length || !customers.length) return <ErrorState error={new Error("No customers or products are available. Refresh after the backend is seeded.")} />;

	return <>
		<Link className="back-link" to="/quotations">← Quotations</Link>
		<PageHeader eyebrow="New opportunity" title="Build a quotation" description="Start with the customer, then shape the right offer." />
		<form className="quote-builder" onSubmit={submit}>
			<section className="panel builder-main">
				<label className="field-wide">Customer<select required value={customerId} onChange={(event) => setCustomerId(event.target.value)}><option value="">Choose a customer</option>{customers.map((customer) => <option value={customer._id} key={customer._id}>{customer.company} · {customer.tier}</option>)}</select></label>
				<div className="panel-heading builder-heading"><div><p className="eyebrow">Line items</p><h2>What are we offering?</h2></div><button className="text-button" type="button" onClick={addItem}>+ Add product</button></div>
				{items.length ? items.map((item, index) => { const product = products.find((currentProduct) => currentProduct._id === item.productId); return <div className="quote-line" key={`${item.productId}-${index}`}><select required value={item.productId} onChange={(event) => updateItem(index, "productId", event.target.value)}>{products.map((option) => <option value={option._id} key={option._id}>{option.name} · ₹{option.price.toLocaleString("en-IN")}</option>)}</select><input type="number" min="1" value={item.quantity} onChange={(event) => updateItem(index, "quantity", event.target.value)} /><div className="discount-input"><input type="number" min="0" max="100" value={item.discount} onChange={(event) => updateItem(index, "discount", event.target.value)} /><span>%</span></div><strong><Money value={(product?.price || 0) * Number(item.quantity) * (1 - Number(item.discount) / 100)} /></strong><button type="button" className="remove-button" onClick={() => setItems(items.filter((_, itemIndex) => itemIndex !== index))}>×</button></div>; }) : <div className="builder-empty"><span>+</span><p>Add a product to begin pricing this opportunity.</p><button className="text-button" type="button" onClick={addItem}>Browse catalog</button></div>}
			</section>
			<aside className="quote-summary"><div className="summary-top"><p className="eyebrow">Live estimate</p><h2><Money value={total} /></h2><span>Backend recalculates final pricing</span></div><div className="summary-row"><span>Products</span><strong>{items.length}</strong></div><div className="summary-row"><span>Discounts</span><strong>Set per line</strong></div><div className="summary-row"><span>Tax & margin</span><strong>On save</strong></div>{error && <p className="form-error">{getErrorMessage(error)}</p>}<Button disabled={saving || !items.length || !customerId}>{saving ? "Creating..." : "Create draft quote ↗"}</Button></aside>
		</form>
	</>;
};

export default CreateQuotation;
