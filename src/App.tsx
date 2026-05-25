import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import { AppProvider } from './contexts/AppContext';
import { DataProvider } from './contexts/DataContext';
import { SaaSProvider } from './contexts/SaaSContext';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

// Lazy load pages to split code chunks and improve initial load time
const ExecutiveDashboard = lazy(() => import('./pages/ExecutiveDashboard'));
const CommitteeView = lazy(() => import('./pages/CommitteeView'));
const UseCaseRegistry = lazy(() => import('./pages/UseCaseRegistry'));
const RiskRegister = lazy(() => import('./pages/RiskRegister'));
const ControlLibrary = lazy(() => import('./pages/ControlLibrary'));
const EvidenceTracker = lazy(() => import('./pages/EvidenceTracker'));
const VendorRisk = lazy(() => import('./pages/VendorRisk'));
const PolicyExceptions = lazy(() => import('./pages/PolicyExceptions'));
const AuditEvents = lazy(() => import('./pages/AuditEvents'));
const ExecutiveBriefing = lazy(() => import('./pages/ExecutiveBriefing'));
const AboutProject = lazy(() => import('./pages/AboutProject'));
const Settings = lazy(() => import('./pages/Settings'));
const AdminConsole = lazy(() => import('./pages/AdminConsole'));
const AgentGovernance = lazy(() => import('./pages/AgentGovernance'));
const BusinessValue = lazy(() => import('./pages/BusinessValue'));
const TraceabilityPage = lazy(() => import('./pages/TraceabilityPage'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <SaaSProvider>
            <DataProvider>
              <BrowserRouter>
                <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={
              <Suspense fallback={<PageLoader />}>
                <ExecutiveDashboard />
              </Suspense>
            } />
            <Route path="committee" element={
              <Suspense fallback={<PageLoader />}>
                <CommitteeView />
              </Suspense>
            } />
            
            <Route path="use-cases" element={
              <Suspense fallback={<PageLoader />}>
                <UseCaseRegistry />
              </Suspense>
            } />
            <Route path="risks" element={
              <Suspense fallback={<PageLoader />}>
                <RiskRegister />
              </Suspense>
            } />
            <Route path="controls" element={
              <Suspense fallback={<PageLoader />}>
                <ControlLibrary />
              </Suspense>
            } />
            <Route path="evidence" element={
              <Suspense fallback={<PageLoader />}>
                <EvidenceTracker />
              </Suspense>
            } />
            <Route path="vendors" element={
              <Suspense fallback={<PageLoader />}>
                <VendorRisk />
              </Suspense>
            } />
            <Route path="exceptions" element={
              <Suspense fallback={<PageLoader />}>
                <PolicyExceptions />
              </Suspense>
            } />
            <Route path="audit" element={
              <Suspense fallback={<PageLoader />}>
                <AuditEvents />
              </Suspense>
            } />
            <Route path="agents" element={
              <Suspense fallback={<PageLoader />}>
                <AgentGovernance />
              </Suspense>
            } />
            <Route path="value" element={
              <Suspense fallback={<PageLoader />}>
                <BusinessValue />
              </Suspense>
            } />
            <Route path="traceability" element={
              <Suspense fallback={<PageLoader />}>
                <TraceabilityPage />
              </Suspense>
            } />
            <Route path="briefing" element={
              <Suspense fallback={<PageLoader />}>
                <ExecutiveBriefing />
              </Suspense>
            } />
            
            <Route path="about" element={
              <Suspense fallback={<PageLoader />}>
                <AboutProject />
              </Suspense>
            } />
            <Route path="settings" element={
              <Suspense fallback={<PageLoader />}>
                <Settings />
              </Suspense>
            } />
            <Route path="admin" element={
              <Suspense fallback={<PageLoader />}>
                <AdminConsole />
              </Suspense>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
          </DataProvider>
        </SaaSProvider>
      </AppProvider>
    </AuthProvider>
  </ErrorBoundary>
  );
}

export default App;
