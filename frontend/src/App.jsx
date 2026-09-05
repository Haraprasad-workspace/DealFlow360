import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthTokenProvider from "./components/AuthTokenProvider";
import AuthPage from "./pages/AuthPage";
import DashboardPlaceholder from "./pages/DashboardPlaceholder";
import CustomerDashboardPage from "./pages/CustomerDashboardPage";
import PortalListPage from "./pages/PortalListPage";
import PortalDetailPage from "./pages/PortalDetailPage";
import ProductCatalogPage from "./pages/ProductCatalogPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import DiscountConfigPage from "./pages/DiscountConfigPage";
import AdminResourcePage from "./pages/AdminResourcePage";
import AdminShell from "./components/AdminShell";
import ProtectedInternalRoute from "./routes/ProtectedInternalRoute";
import ProtectedPortalRoute from "./routes/ProtectedPortalRoute";

function App() {
	return (
		<BrowserRouter>
			<AuthTokenProvider>
				<Routes>
					<Route path="/auth" element={<AuthPage />} />

					<Route element={<ProtectedInternalRoute />}>
						<Route path="/dashboard" element={<DashboardPlaceholder />} />
						<Route element={<AdminShell />}>
							<Route path="/catalog" element={<ProductCatalogPage />} />
							<Route path="/catalog/:productId" element={<ProductDetailPage />} />
							<Route path="/admin/discount-tiers" element={<DiscountConfigPage />} />
							<Route path="/admin/warehouses" element={<AdminResourcePage resource="warehouses" />} />
							<Route path="/admin/subscription-plans" element={<AdminResourcePage resource="subscriptionPlans" />} />
						</Route>
					</Route>

					<Route element={<ProtectedPortalRoute />}>
						<Route path="/portal" element={<CustomerDashboardPage />} />
						<Route path="/portal/:resource" element={<PortalListPage />} />
						<Route path="/portal/:resource/:id" element={<PortalDetailPage />} />
					</Route>

					<Route path="/" element={<Navigate to="/auth" replace />} />
					<Route path="*" element={<Navigate to="/auth" replace />} />
				</Routes>
			</AuthTokenProvider>
		</BrowserRouter>
	);
}

export default App;
