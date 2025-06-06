import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loading from '../common/Loading';

// Lazy load pages
const Dashboard = lazy(() => import('../modules/dashboard/pages/DashboardPage'));
const GymMembersPage = lazy(() => import('../modules/gymMember/pages/GymMembersPage'));
const ModalCreateMember = lazy(() => import('../modules/gymMember/components/ModalCreateMember.jsx'));
const MembershipPage = lazy(() => import('../modules/membershipPlan/pages/MembershipPage'));
const ModalCreateMembership = lazy(() => import('../modules/membershipPlan/pages/ModalCreateMembership'));
const AnalyticsPage = lazy(() => import('../modules/analytics/pages/AnalyticsPage'));
const SettingsPage = lazy(() => import('../modules/settings/pages/SettingsPage'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/members" element={<GymMembersPage />} />
        <Route path="/members/new" element={<ModalCreateMember />} />
        <Route path="/membership-plans" element={<MembershipPage />} />
        <Route path="/membership-plans/new" element={<ModalCreateMembership />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        {/* Add more routes as needed */}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
