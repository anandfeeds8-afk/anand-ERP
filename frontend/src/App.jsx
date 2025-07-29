import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "./pages/LoginPage";
import AdminDashboardPage from "./pages/Admin/AdminDashboardPage";
import AdminLayout from "./layouts/AdminLayout";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* ADMIN */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="product-management" element={<AdminDashboardPage />} />
            <Route
              path="employee-management"
              element={<AdminDashboardPage />}
            />
            <Route path="party-master" element={<AdminDashboardPage />} />
            <Route path="reports-module" element={<AdminDashboardPage />} />
            <Route path="settings-security" element={<AdminDashboardPage />} />
          </Route>

          {/* SALESMAN */}
          <Route path="/salesman" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
          </Route>

          {/* LOGIN */}
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
