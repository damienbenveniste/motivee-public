import { Navigate, useRoutes } from 'react-router-dom'
import PrivateRoute from 'route/PrivateRoute'
import GuestRoute from 'route/GuestRoute'
import LoginContainer from 'pages/login/LoginContainer'
import ConversationFinder from 'pages/finder/ConversationFinder'
import ClaimsViewContext from 'pages/claims/ClaimsView'
import MainLayout from 'layout/MainLayout'
import VerifyEmailView from 'pages/login/VerifyEmailView'
import ConversationLayout from 'layout/ConversationLayout'
import TopClaims from 'pages/insight/top-claims/TopClaims'
import Overview from 'pages/insight/overview/Overview'
import ProfilePage from 'pages/profile/ProfilePage'
import ProfileOwnerRoute from './ProfileOwnerRoute'
import QuestionnaireView from 'pages/questionnaire/QuestionnaireView'
import FeedView from 'pages/feed/FeedView'
import AdminRoute from 'route/AdminRoute'
import WorkspaceView from 'pages/workspaces/WorkspaceView'
import HandleVerifyEmailView from 'pages/login/HandleVerifyEmailView'
import PaymentPage from 'pages/pricing/PaymentPage'
import AdminPage from 'pages/admin/AdminPage'
import AdminLayout from 'layout/AdminLayout'
import BillingPage from 'pages/admin/BillingPage'
import UpgadePage from 'pages/admin/UpgradePage'
import SubscriptionRoute from './SubscriptionRoute'
import HowToPage from 'pages/how_to/HowToPage'
import ResetPasswordPage from 'pages/login/ResetPasswordPage'
import SignupContainer from 'pages/login/SignupContainer'
import InviteRoute from 'pages/login/InviteRoute'
import DialogPage from 'pages/dialogs/DialogPage'


export default function Router() {
    return useRoutes([
        {
            path: '/invite',
            element: (
                <InviteRoute />
            ),
        },
        {
            path: '/dialog',
            element: (
                <DialogPage />
            ),
        },
        {
            path: '/login',
            element: (
                <GuestRoute>
                    <LoginContainer />
                </GuestRoute>
            ),
        },
        {
            path: '/signup',
            element: (
                <SignupContainer />
            ),
        },
        {
            path: '/handle-verify-email/__/auth/action',
            element: (
                <HandleVerifyEmailView />
            ),
        },
        {
            path: '/reset-password',
            element: (
                <ResetPasswordPage />
            ),
        },
        {
            path: '/verify-email',
            element: (
                <GuestRoute>
                    <VerifyEmailView />
                </GuestRoute>
            ),
        },
        {
            path: '/workspace',
            element: (
                <GuestRoute>
                    <WorkspaceView />
                </GuestRoute>
            ),
        },
        {
            path: '/:customerId/questionaire',
            element: (
                <GuestRoute>
                    <QuestionnaireView />
                </GuestRoute>
            ),
        },
        {
            path: '/:customerId',
            element: (
                <PrivateRoute>
                    <SubscriptionRoute>
                        <MainLayout />
                    </SubscriptionRoute>
                </PrivateRoute>
            ),
            children: [
                { element: <Navigate to='conversations' replace />, index: true },
                { path: 'conversations', element: <ConversationFinder /> },
                { path: 'feed', element: <FeedView /> },
                {
                    path: 'how-to',
                    element: <HowToPage />
                },
                {
                    path: 'profile/:profileId',
                    element: <ProfileOwnerRoute>
                        <ProfilePage />
                    </ProfileOwnerRoute>
                },
                {
                    path: 'payment',
                    element: <AdminRoute>
                        <PaymentPage />
                    </AdminRoute>
                },
                {
                    path: 'admin',
                    element: <AdminRoute>
                        <AdminLayout />
                    </AdminRoute>,
                    children: [
                        { element: <Navigate to='workspace' replace />, index: true },
                        { path: 'workspace', element: <AdminPage /> },
                        { path: 'billing', element: <BillingPage /> },

                    ]

                },
                {
                    path: 'upgrade',
                    element: (
                        <UpgadePage />
                    ),
                },

            ]
        },
        {
            element: (
                <PrivateRoute>
                    <SubscriptionRoute>
                        <ConversationLayout />
                    </SubscriptionRoute>
                </PrivateRoute>
            ),
            children: [

                { path: '/:customerId/conversation/:conversationId/:claimId', element: <ClaimsViewContext /> },
                {
                    path: '/:customerId/insight/:conversationId',
                    children: [
                        {
                            element: <AdminRoute>
                                <Navigate to='overview' replace />
                            </AdminRoute>, index: true
                        },
                        {
                            path: 'overview',
                            element: <AdminRoute>
                                <Overview />
                            </AdminRoute>
                        },
                        {
                            path: 'top-claims',
                            element: <AdminRoute>
                                <TopClaims />
                            </AdminRoute>
                        },
                        {
                            path: 'top-claims/:tag',
                            element: <AdminRoute>
                                <TopClaims />
                            </AdminRoute>
                        },
                    ]
                },

            ]
        },
        { path: '*', element: <Navigate to='/login' replace /> },
    ])
}