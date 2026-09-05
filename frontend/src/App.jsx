import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthTokenProvider from "./components/AuthTokenProvider";
import AuthPage from "./pages/AuthPage";
import DashboardPlaceholder from "./pages/DashboardPlaceholder";
import PortalPlaceholder from "./pages/PortalPlaceholder";
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
					</Route>

					<Route element={<ProtectedPortalRoute />}>
						<Route path="/portal" element={<PortalPlaceholder />} />
					</Route>

					<Route path="/" element={<Navigate to="/auth" replace />} />
					<Route path="*" element={<Navigate to="/auth" replace />} />
				</Routes>
			</AuthTokenProvider>
		</BrowserRouter>
	);
}

export default App;
