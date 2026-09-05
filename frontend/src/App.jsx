import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import AuthTokenProvider from "./components/AuthTokenProvider";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import Products from "./pages/Products";
import Quotations from "./pages/Quotations";
import CreateQuotation from "./pages/CreateQuotation";
import QuotationDetails from "./pages/QuotationDetails";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import PortalPlaceholder from "./pages/PortalPlaceholder";
import SalesRepLayout from "./components/SalesRepLayout";
import SalesManagerLayout from "./layouts/SalesManagerLayout";
import ManagerDashboard from "./pages/sales-manager/ManagerDashboard";
import ManagerApprovals from "./pages/sales-manager/ManagerApprovals";
import ManagerApprovalDetails from "./pages/sales-manager/ManagerApprovalDetails";
import ManagerQuotations from "./pages/sales-manager/ManagerQuotations";
import ManagerQuotationDetails from "./pages/sales-manager/ManagerQuotationDetails";
import ManagerOrders from "./pages/sales-manager/ManagerOrders";
import ManagerOrderDetails from "./pages/sales-manager/ManagerOrderDetails";
import ManagerReports from "./pages/sales-manager/ManagerReports";
import FrontendErrorBoundary from "./components/FrontendErrorBoundary";
import ProtectedInternalRoute from "./routes/ProtectedInternalRoute";
import ProtectedPortalRoute from "./routes/ProtectedPortalRoute";
import RoleRoute from "./routes/RoleRoute";
import { USER_ROLES } from "./constants/roles";


function App() {
	return (
		<FrontendErrorBoundary>
			<BrowserRouter>
				<AuthTokenProvider>
					<Routes>
						<Route path="/auth" element={<AuthPage />} />

						<Route element={<ProtectedInternalRoute />}>
							{/* Sales Rep Routes */}
							<Route element={<RoleRoute allowedRoles={[USER_ROLES.SALES_REP, USER_ROLES.ADMIN]} />}>
								<Route element={<SalesRepLayout />}>
									<Route path="/sales-rep/dashboard" element={<Dashboard />} />
									<Route path="/sales-rep/customers" element={<Customers />} />
									<Route path="/sales-rep/customers/:customerId" element={<CustomerDetails />} />
									<Route path="/sales-rep/products" element={<Products />} />
									<Route path="/sales-rep/quotations" element={<Quotations />} />
									<Route path="/sales-rep/quotations/new" element={<CreateQuotation />} />
									<Route path="/sales-rep/quotations/:quotationId" element={<QuotationDetails />} />
									<Route path="/sales-rep/orders" element={<Orders />} />
									<Route path="/sales-rep/orders/:orderId" element={<OrderDetails />} />
									{/* Legacy route redirects for Sales Reps */}
									<Route path="/dashboard" element={<Navigate to="/sales-rep/dashboard" replace />} />
									<Route path="/customers" element={<Navigate to="/sales-rep/customers" replace />} />
									<Route path="/products" element={<Navigate to="/sales-rep/products" replace />} />
									<Route path="/quotations" element={<Navigate to="/sales-rep/quotations" replace />} />
									<Route path="/orders" element={<Navigate to="/sales-rep/orders" replace />} />
								</Route>
							</Route>

							{/* Sales Manager Routes */}
							<Route element={<RoleRoute allowedRoles={[USER_ROLES.SALES_MANAGER, USER_ROLES.ADMIN]} />}>
								<Route element={<SalesManagerLayout />}>
									<Route path="/sales-manager/dashboard" element={<ManagerDashboard />} />
									<Route path="/sales-manager/approvals" element={<ManagerApprovals />} />
									<Route path="/sales-manager/approvals/:id" element={<ManagerApprovalDetails />} />
									<Route path="/sales-manager/quotations" element={<ManagerQuotations />} />
									<Route path="/sales-manager/quotations/:id" element={<ManagerQuotationDetails />} />
									<Route path="/sales-manager/orders" element={<ManagerOrders />} />
									<Route path="/sales-manager/orders/:id" element={<ManagerOrderDetails />} />
									<Route path="/sales-manager/reports" element={<ManagerReports />} />
								</Route>
							</Route>
						</Route>

						<Route element={<ProtectedPortalRoute />}>
							<Route path="/portal" element={<PortalPlaceholder />} />
						</Route>

						<Route path="/" element={<Navigate to="/auth" replace />} />
						<Route path="*" element={<Navigate to="/auth" replace />} />
					</Routes>
				</AuthTokenProvider>
			</BrowserRouter>
		</FrontendErrorBoundary>
	);
}

export default App;
