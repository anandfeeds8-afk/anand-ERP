import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboardPage from "./pages/Admin/AdminDashboardPage";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/Login/LoginPage";
import SalesmanDashboardPage from "./pages/Salesman/SalesmanDashboardPage";
import ProductManagementPage from "./pages/Admin/ProductManagementPage";
import EmployeeManagementPage from "./pages/Admin/EmployeeManagementPage";
import OrderManagementPage from "./pages/Admin/OrderManagementPage";
import PlantManagementPage from "./pages/Admin/PlantManagementPage";
import ProtectedRoutes from "./ui/ProtectedRoutes";
import SalesAuthorizerDashboardPage from "./pages/SalesAuthorizer/SalesAuthorizerDashboardPage";
import SalesManagerDashboardPage from "./pages/SalesManager/SalesManagerDashboardPage";
import PlantheadDashboardPage from "./pages/Planthead/PlantheadDashboardPage";
import AccoutantDashboardPage from "./pages/Accountant/AccoutantDashboardPage";
import ReportsPage from "./pages/Admin/ReportsPage";
import ProductsManagementPage from "./pages/Planthead/ProductsManagementPage";
import PartyManagementPage from "./pages/Salesman/PartyManagementPage";
import PartyManagementPageAdmin from "./pages/Admin/PartyManagementPage";

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoutes>
            <MainLayout />
          </ProtectedRoutes>
        }
      >
        {/* Admin routes*/}
        <Route path="admin">
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route
            path="product-management"
            element={<ProductManagementPage />}
          />
          <Route
            path="employee-management"
            element={<EmployeeManagementPage />}
          />
          <Route path="order-management" element={<OrderManagementPage />} />
          <Route path="plant-management" element={<PlantManagementPage />} />
          <Route
            path="party-management"
            element={<PartyManagementPageAdmin />}
          />
          <Route path="reports-module" element={<ReportsPage />} />
        </Route>

        {/* Salesman routes */}
        <Route path="salesman">
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SalesmanDashboardPage />} />
          <Route path="party-management" element={<PartyManagementPage />} />
        </Route>

        {/* Sales Manager routes */}
        <Route path="salesmanager">
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SalesManagerDashboardPage />} />
        </Route>

        {/* Sales Authorizer routes */}
        <Route path="salesauthorizer">
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SalesAuthorizerDashboardPage />} />
        </Route>

        {/* Plant Head routes */}
        <Route path="planthead">
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PlantheadDashboardPage />} />
          <Route
            path="product-management"
            element={<ProductsManagementPage />}
          />
        </Route>

        {/* Accountant routes */}
        <Route path="accountant">
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AccoutantDashboardPage />} />
        </Route>
      </Route>

      {/* Login route */}
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};

export default App;
