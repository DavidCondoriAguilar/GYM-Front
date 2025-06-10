import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loading from '../common/Loading';

// Lazy load pages
const Dashboard = lazy(() => import('../modules/dashboard/pages/DashboardPage'));
const GymMembersPage = lazy(() => import('../modules/gymMember/pages/GymMembersPage'));
const ModalCreateMember = lazy(() => import('../modules/gymMember/pages/ModalCreateMember'));
const MembershipPage = lazy(() => import('../modules/membershipPlan/pages/MembershipPage'));
const ModalCreateMembership = lazy(() => import('../modules/membershipPlan/pages/ModalCreateMembership'));
const ModalEditMembership = lazy(() => import('../modules/membershipPlan/pages/ModalEditMembership'));
const ModalDetailsMembership = lazy(() => import('../modules/membershipPlan/pages/ModalDetailsMembership'));
const MembershipPlanById = lazy(() => import('../modules/membershipPlan/components/MembershipPlanById'));
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
        <Route path="/membership-plans/:id" element={<ModalDetailsMembership />} />
        <Route path="/membership-plans/old/:id" element={<MembershipPlanById />} />
        <Route path="/membership-plans/new" element={<ModalCreateMembership />} />
        <Route path="/membership-plans/:id/edit" element={<ModalEditMembership />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        {/* Add more routes as needed */}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
