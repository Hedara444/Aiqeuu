import "./global.css";

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import ResetPasswordNew from "./pages/ResetPasswordNew";
import Verification from "./pages/Verification";
import Dashboard from "./pages/Dashboard";
import CreatePosition from "./pages/CreatePosition";
import CriteriaSelection from "./pages/CriteriaSelection";
import CriteriaManagement from "./pages/CriteriaManagement";
import CriteriaSimple from "./pages/CriteriaSimple";
import UploadCV from "./pages/UploadCV";
import Analysis from "./pages/Analysis";
import ViewResult from "./pages/ViewResult";
import UseCases from "./pages/UseCases";
import PositionView from "./pages/PositionView";
import AnalysisCompleted from "./pages/AnalysisCompleted";
import Pricing from "./pages/Pricing";
import ChangePassword from "./pages/ChangePassword";
import Feedback from "./pages/Feedback";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Billing from "./pages/Billing";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer />
      <BrowserRouter>
        <Routes>

          <Route path="/payment-success" element={<Dashboard />} />
          <Route path="/payment-cancel" element={<Dashboard />} />

          {/* public routes */}
          <Route element={<PublicRoute />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ResetPassword />} />
            <Route path="/reset-password" element={<ResetPasswordNew />} />
            <Route path="/verification" element={<Verification />} />
          </Route>

          {/* private routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/history" element={<History />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/change-password" element={<ChangePassword />} />


            <Route path="/use-cases" element={<UseCases />} />
            <Route path="/position/:id" element={<PositionView />} />
            <Route path="/position/:id/completed" element={<AnalysisCompleted />} />


            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-position" element={<CreatePosition />} />
            <Route path="/criteria-selection/:id" element={<CriteriaSelection />} />
            <Route path="/create-criteria/:id" element={<CriteriaSimple />} />
            <Route path="/upload-cv/:id" element={<UploadCV />} />
            <Route path="/analysis/:id" element={<Analysis />} />
            <Route path="/view-result/:id" element={<ViewResult />} />

            <Route path="/criteria-management" element={<CriteriaManagement />} />

          </Route>


          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
