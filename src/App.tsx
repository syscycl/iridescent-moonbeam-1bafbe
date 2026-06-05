import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import Home from '@/pages/Home'
import RegisterPage from '@/pages/RegisterPage'
import LoginPage from '@/pages/LoginPage'
import ForgotPassword from '@/pages/ForgotPassword'
import ImpactCalculator from '@/pages/ImpactCalculator'
import InnovationsLibrary from '@/pages/InnovationsLibrary'
import Gallery from '@/pages/Gallery'
import ChatPage from '@/pages/ChatPage'
import ChatLog from '@/pages/ChatLog'
import EmailTemplates from '@/pages/EmailTemplates'
import AdminPanel from '@/pages/AdminPanel'
import AdminMap from '@/pages/AdminMap'
import HouseholdDashboard from '@/pages/HouseholdDashboard'
import VolunteerDashboard from '@/pages/VolunteerDashboard'
import SponsorDashboard from '@/pages/SponsorDashboard'
import SocialFeed from '@/pages/SocialFeed'
import ContentScheduler from '@/pages/ContentScheduler'
import AssetLibrary from '@/pages/AssetLibrary'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/impact" element={<ImpactCalculator />} />
        <Route path="/innovations" element={<InnovationsLibrary />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/social" element={<SocialFeed />} />
        <Route path="/scheduler" element={<ContentScheduler />} />
        <Route path="/assets" element={<AssetLibrary />} />
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPanel />
          </ProtectedRoute>
        } />
        <Route path="/admin/map" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminMap />
          </ProtectedRoute>
        } />
        <Route path="/admin/email-templates" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <EmailTemplates />
          </ProtectedRoute>
        } />
        <Route path="/chats" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ChatLog />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/household" element={
          <ProtectedRoute allowedRoles={['household']}>
            <HouseholdDashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/volunteer" element={
          <ProtectedRoute allowedRoles={['volunteer']}>
            <VolunteerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/sponsor" element={
          <ProtectedRoute allowedRoles={['sponsor']}>
            <SponsorDashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
