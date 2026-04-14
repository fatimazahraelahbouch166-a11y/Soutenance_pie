// // import { Routes, Route, Navigate } from 'react-router-dom'
// // import { AuthProvider, useAuth } from './contexts/AuthContext'
// // import { ToastProvider } from './contexts/ToastContext'
// // import Layout              from './components/Layout'
// // import LandingPage         from './pages/LandingPage'
// // import LoginPage           from './pages/LoginPage'
// // import RegisterPage        from './pages/RegisterPage'
// // import DashboardPage       from './pages/DashboardPage'
// // import ExpensesPage        from './pages/ExpensesPage'
// // import NewExpensePage      from './pages/NewExpensePage'
// // import ExpenseDetailPage   from './pages/ExpenseDetailPage'
// // import ValidationPage      from './pages/ValidationPage'
// // import BudgetsPage         from './pages/BudgetsPage'
// // import ReimbursementsPage  from './pages/ReimbursementsPage'
// // import ReportsPage         from './pages/ReportsPage'
// // import ProfilePage         from './pages/ProfilePage'
// // import SettingsPage        from './pages/SettingsPage'
// // import CategoriesPage      from './pages/CategoriesPage'
// // import UsersPage           from './pages/UsersPage'
// // import PricingPage         from './pages/PricingPage'
// // import SubscriptionPage    from './pages/SubscriptionPage'
// // import CustomersPage       from './pages/CustomersPage'
// // import SuppliersPage       from './pages/SuppliersPage'
// // import QuotesPage          from './pages/QuotesPage'
// // import StockPage           from './pages/StockPage'
// // import IncomePage          from './pages/IncomePage'

// // function Loader() {
// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
// //       <div className="flex flex-col items-center gap-3">
// //         <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
// //         <p className="text-sm text-gray-400">Chargement…</p>
// //       </div>
// //     </div>
// //   )
// // }

// // function ProtectedRoute({ children }) {
// //   const { user, loading } = useAuth()
// //   if (loading) return <Loader />
// //   return user ? children : <Navigate to="/login" replace />
// // }

// // function GuestRoute({ children }) {
// //   const { user, loading } = useAuth()
// //   if (loading) return <Loader />
// //   return user ? <Navigate to="/dashboard" replace /> : children
// // }

// // export default function App() {
// //   return (
// //     <AuthProvider>
// //       <ToastProvider>
// //         <Routes>
// //           {/* Page d'accueil publique */}
// //           <Route path="/"         element={<LandingPage />} />
// //           <Route path="/pricing"  element={<PricingPage />} />

// //           {/* Auth */}
// //           <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
// //           <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

// //           {/* App connectée */}
// //           <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
// //             <Route index element={<Navigate to="/app/dashboard" replace />} />
// //             <Route path="dashboard"       element={<DashboardPage />} />
// //             <Route path="expenses"        element={<ExpensesPage />} />
// //             <Route path="expenses/new"    element={<NewExpensePage />} />
// //             <Route path="expenses/:id"    element={<ExpenseDetailPage />} />
// //             <Route path="validation"      element={<ValidationPage />} />
// //             <Route path="budgets"         element={<BudgetsPage />} />
// //             <Route path="reimbursements"  element={<ReimbursementsPage />} />
// //             <Route path="reports"         element={<ReportsPage />} />
// //             <Route path="profile"         element={<ProfilePage />} />
// //             <Route path="settings"        element={<SettingsPage />} />
// //             <Route path="categories"      element={<CategoriesPage />} />
// //             <Route path="users"           element={<UsersPage />} />
// //             <Route path="subscription"    element={<SubscriptionPage />} />
// //             <Route path="customers"       element={<CustomersPage />} />
// //             <Route path="suppliers"       element={<SuppliersPage />} />
// //             <Route path="quotes"          element={<QuotesPage />} />
// //             <Route path="stock"           element={<StockPage />} />
// //             <Route path="incomes"         element={<IncomePage />} />
// //           </Route>

// //           {/* Redirect /dashboard → /app/dashboard pour compatibilité */}
// //           <Route path="/dashboard"      element={<ProtectedRoute><Navigate to="/app/dashboard" replace /></ProtectedRoute>} />
// //           <Route path="/expenses"       element={<ProtectedRoute><Navigate to="/app/expenses" replace /></ProtectedRoute>} />
// //           <Route path="/validation"     element={<ProtectedRoute><Navigate to="/app/validation" replace /></ProtectedRoute>} />
// //           <Route path="/budgets"        element={<ProtectedRoute><Navigate to="/app/budgets" replace /></ProtectedRoute>} />
// //           <Route path="/profile"        element={<ProtectedRoute><Navigate to="/app/profile" replace /></ProtectedRoute>} />
// //           <Route path="/settings"       element={<ProtectedRoute><Navigate to="/app/settings" replace /></ProtectedRoute>} />
// //           <Route path="/users"          element={<ProtectedRoute><Navigate to="/app/users" replace /></ProtectedRoute>} />
// //           <Route path="/subscription"   element={<ProtectedRoute><Navigate to="/app/subscription" replace /></ProtectedRoute>} />

// //           <Route path="*" element={<Navigate to="/" replace />} />
// //         </Routes>
// //       </ToastProvider>
// //     </AuthProvider>
// //   )
// // }
// import EquipeDashboard       from './pages/EquipeDashboard'
// import EquipeTimeline        from './pages/equipe/EquipeTimeline'
// import EquipeOCR             from './pages/equipe/EquipeOCR'
// import EquipeReimbHistory    from './pages/equipe/EquipeReimbHistory'
// import EquipeReports         from './pages/equipe/EquipeReports'
// import EquipeTemplates       from './pages/equipe/EquipeTemplates'
// import EquipeMissions        from './pages/equipe/EquipeMissions'
// import EquipeChat from './pages/equipe/EquipeChat'
// import EquipeMonthlySummary  from './pages/equipe/EquipeMonthlySummary'
// import EquipeBudgetAlerts    from './pages/equipe/EquipeBudgetAlerts'
// import { Routes, Route, Navigate } from 'react-router-dom'
// import { AuthProvider, useAuth } from './contexts/AuthContext'
// import { ToastProvider } from './contexts/ToastContext'
// import Layout              from './components/Layout'
// import LandingPage         from './pages/LandingPage'
// import LoginPage           from './pages/LoginPage'
// import RegisterPage        from './pages/RegisterPage'
// import DashboardPage       from './pages/DashboardPage'
// import ExpensesPage        from './pages/ExpensesPage'
// import NewExpensePage      from './pages/NewExpensePage'
// import ExpenseDetailPage   from './pages/ExpenseDetailPage'
// import ValidationPage      from './pages/ValidationPage'
// import BudgetsPage         from './pages/BudgetsPage'
// import ReimbursementsPage       from './pages/ReimbursementsPage'
// import ReimbursementDetailPage  from './pages/ReimbursementDetailPage'
// import ReportsPage              from './pages/ReportsPage'
// import ProfilePage         from './pages/ProfilePage'
// import SettingsPage        from './pages/SettingsPage'
// import CategoriesPage      from './pages/CategoriesPage'
// import UsersPage           from './pages/UsersPage'
// import PricingPage         from './pages/PricingPage'
// import SubscriptionPage    from './pages/SubscriptionPage'
// import PaymentPage         from './pages/PaymentPage'
// import { SubscriptionProvider } from './contexts/SubscriptionContext'
// import CustomersPage       from './pages/CustomersPage'
// import SuppliersPage       from './pages/SuppliersPage'
// import QuotesPage          from './pages/QuotesPage'
// import StockPage           from './pages/StockPage'
// import IncomePage          from './pages/IncomePage'
// // Accounting module
// import AccountingDashboard from './pages/accounting/AccountingDashboard'
// import JournalPage         from './pages/accounting/JournalPage'
// import LedgerPage          from './pages/accounting/LedgerPage'
// import BalancePage         from './pages/accounting/BalancePage'
// import BilanPage           from './pages/accounting/BilanPage'
// import CpcPage             from './pages/accounting/CpcPage'
// import InvoicesPage        from './pages/accounting/InvoicesPage'
// import TaxesPage           from './pages/accounting/TaxesPage'
// import PaymentsPage        from './pages/accounting/PaymentsPage'

// function Loader() {
//   return (
//     <div style={{
//       minHeight: '100vh',
//       display: 'flex', flexDirection: 'column',
//       alignItems: 'center', justifyContent: 'center',
//       gap: 16, background: 'var(--cream)',
//     }}>
//       {/* Logo mark */}
//       <div style={{
//         width: 40, height: 40, borderRadius: 12,
//         background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)',
//         display: 'flex', alignItems: 'center', justifyContent: 'center',
//         boxShadow: '0 4px 16px rgba(61,90,128,0.28)',
//         marginBottom: 4,
//       }}>
//         <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, letterSpacing: '.04em' }}>EQ</span>
//       </div>

//       {/* Spinner */}
//       <div style={{
//         width: 24, height: 24, borderRadius: '50%',
//         border: '2px solid var(--pearl)',
//         borderTopColor: 'var(--accent)',
//         animation: 'spin 0.7s linear infinite',
//       }} />

//       <p style={{ fontSize: 12.5, color: 'var(--silver)', letterSpacing: '0.04em' }}>Chargement…</p>

//       <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//     </div>
//   )
// }

// function ProtectedRoute({ children }) {
//   const { user, loading } = useAuth()
//   if (loading) return <Loader />
//   return user ? children : <Navigate to="/login" replace />
// }

// function GuestRoute({ children }) {
//   const { user, loading } = useAuth()
//   if (loading) return <Loader />
//   return user ? <Navigate to="/dashboard" replace /> : children
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <ToastProvider>
//         <Routes>
//           {/* Public */}
//           <Route path="/"        element={<LandingPage />} />
//           <Route path="/pricing" element={<PricingPage />} />

//           {/* Auth */}
//           <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
//           <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

//           {/* App protégée */}
//           <Route path="/app" element={<ProtectedRoute><SubscriptionProvider><Layout /></SubscriptionProvider></ProtectedRoute>}>
//             <Route index element={<Navigate to="/app/dashboard" replace />} />
//             <Route path="dashboard"      element={<DashboardPage />} />
//             <Route path="expenses"       element={<ExpensesPage />} />
//             <Route path="expenses/new"   element={<NewExpensePage />} />
//             <Route path="expenses/:id"   element={<ExpenseDetailPage />} />
//             <Route path="validation"     element={<ValidationPage />} />
//             <Route path="budgets"        element={<BudgetsPage />} />
//             <Route path="reimbursements"     element={<ReimbursementsPage />} />
//             <Route path="reimbursements/:id" element={<ReimbursementDetailPage />} />
//             <Route path="reports"        element={<ReportsPage />} />
//             <Route path="profile"        element={<ProfilePage />} />
//             <Route path="settings"       element={<SettingsPage />} />
//             <Route path="categories"     element={<CategoriesPage />} />
//             <Route path="users"          element={<UsersPage />} />
//             <Route path="subscription"   element={<SubscriptionPage />} />
//             <Route path="pricing"        element={<PricingPage />} />
//             <Route path="payment"        element={<PaymentPage />} />
//             <Route path="customers"      element={<CustomersPage />} />
//             <Route path="suppliers"      element={<SuppliersPage />} />
//             <Route path="quotes"         element={<QuotesPage />} />
//             <Route path="stock"          element={<StockPage />} />
//             <Route path="incomes"        element={<IncomePage />} />
//             {/* Accounting module */}
//             <Route path="accounting"              element={<AccountingDashboard />} />
//             <Route path="accounting/journal"      element={<JournalPage />} />
//             <Route path="accounting/ledger"       element={<LedgerPage />} />
//             <Route path="accounting/balance"      element={<BalancePage />} />
//             <Route path="accounting/bilan"        element={<BilanPage />} />
//             <Route path="accounting/cpc"          element={<CpcPage />} />
//             <Route path="accounting/invoices"     element={<InvoicesPage />} />
//             <Route path="accounting/taxes"        element={<TaxesPage />} />
//             <Route path="accounting/payments"     element={<PaymentsPage />} />
//           </Route>
//           <Route path="/app" element={<ProtectedRoute><SubscriptionProvider><Layout /></SubscriptionProvider></ProtectedRoute>}>
//           {/* ===== ESPACE ÉQUIPE ===== */}

          
//           </Route>
//           {/* Redirects de compatibilité */}
//           <Route path="/dashboard"    element={<ProtectedRoute><Navigate to="/app/dashboard" replace /></ProtectedRoute>} />
//           <Route path="/expenses"     element={<ProtectedRoute><Navigate to="/app/expenses" replace /></ProtectedRoute>} />
//           <Route path="/validation"   element={<ProtectedRoute><Navigate to="/app/validation" replace /></ProtectedRoute>} />
//           <Route path="/budgets"      element={<ProtectedRoute><Navigate to="/app/budgets" replace /></ProtectedRoute>} />
//           <Route path="/profile"      element={<ProtectedRoute><Navigate to="/app/profile" replace /></ProtectedRoute>} />
//           <Route path="/settings"     element={<ProtectedRoute><Navigate to="/app/settings" replace /></ProtectedRoute>} />
//           <Route path="/users"        element={<ProtectedRoute><Navigate to="/app/users" replace /></ProtectedRoute>} />
//           <Route path="/subscription" element={<ProtectedRoute><Navigate to="/app/subscription" replace /></ProtectedRoute>} />

//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </ToastProvider>
//     </AuthProvider>
//   )
// }
// import { Routes, Route, Navigate } from 'react-router-dom'
// import { AuthProvider, useAuth } from './contexts/AuthContext'
// import { ToastProvider } from './contexts/ToastContext'
// import Layout              from './components/Layout'
// import LandingPage         from './pages/LandingPage'
// import LoginPage           from './pages/LoginPage'
// import RegisterPage        from './pages/RegisterPage'
// import DashboardPage       from './pages/DashboardPage'
// import ExpensesPage        from './pages/ExpensesPage'
// import NewExpensePage      from './pages/NewExpensePage'
// import ExpenseDetailPage   from './pages/ExpenseDetailPage'
// import ValidationPage      from './pages/ValidationPage'
// import BudgetsPage         from './pages/BudgetsPage'
// import ReimbursementsPage  from './pages/ReimbursementsPage'
// import ReportsPage         from './pages/ReportsPage'
// import ProfilePage         from './pages/ProfilePage'
// import SettingsPage        from './pages/SettingsPage'
// import CategoriesPage      from './pages/CategoriesPage'
// import UsersPage           from './pages/UsersPage'
// import PricingPage         from './pages/PricingPage'
// import SubscriptionPage    from './pages/SubscriptionPage'
// import CustomersPage       from './pages/CustomersPage'
// import SuppliersPage       from './pages/SuppliersPage'
// import QuotesPage          from './pages/QuotesPage'
// import StockPage           from './pages/StockPage'
// import IncomePage          from './pages/IncomePage'

// function Loader() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="flex flex-col items-center gap-3">
//         <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
//         <p className="text-sm text-gray-400">Chargement…</p>
//       </div>
//     </div>
//   )
// }

// function ProtectedRoute({ children }) {
//   const { user, loading } = useAuth()
//   if (loading) return <Loader />
//   return user ? children : <Navigate to="/login" replace />
// }

// function GuestRoute({ children }) {
//   const { user, loading } = useAuth()
//   if (loading) return <Loader />
//   return user ? <Navigate to="/dashboard" replace /> : children
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <ToastProvider>
//         <Routes>
//           {/* Page d'accueil publique */}
//           <Route path="/"         element={<LandingPage />} />
//           <Route path="/pricing"  element={<PricingPage />} />

//           {/* Auth */}
//           <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
//           <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

//           {/* App connectée */}
//           <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
//             <Route index element={<Navigate to="/app/dashboard" replace />} />
//             <Route path="dashboard"       element={<DashboardPage />} />
//             <Route path="expenses"        element={<ExpensesPage />} />
//             <Route path="expenses/new"    element={<NewExpensePage />} />
//             <Route path="expenses/:id"    element={<ExpenseDetailPage />} />
//             <Route path="validation"      element={<ValidationPage />} />
//             <Route path="budgets"         element={<BudgetsPage />} />
//             <Route path="reimbursements"  element={<ReimbursementsPage />} />
//             <Route path="reports"         element={<ReportsPage />} />
//             <Route path="profile"         element={<ProfilePage />} />
//             <Route path="settings"        element={<SettingsPage />} />
//             <Route path="categories"      element={<CategoriesPage />} />
//             <Route path="users"           element={<UsersPage />} />
//             <Route path="subscription"    element={<SubscriptionPage />} />
//             <Route path="customers"       element={<CustomersPage />} />
//             <Route path="suppliers"       element={<SuppliersPage />} />
//             <Route path="quotes"          element={<QuotesPage />} />
//             <Route path="stock"           element={<StockPage />} />
//             <Route path="incomes"         element={<IncomePage />} />
//           </Route>

//           {/* Redirect /dashboard → /app/dashboard pour compatibilité */}
//           <Route path="/dashboard"      element={<ProtectedRoute><Navigate to="/app/dashboard" replace /></ProtectedRoute>} />
//           <Route path="/expenses"       element={<ProtectedRoute><Navigate to="/app/expenses" replace /></ProtectedRoute>} />
//           <Route path="/validation"     element={<ProtectedRoute><Navigate to="/app/validation" replace /></ProtectedRoute>} />
//           <Route path="/budgets"        element={<ProtectedRoute><Navigate to="/app/budgets" replace /></ProtectedRoute>} />
//           <Route path="/profile"        element={<ProtectedRoute><Navigate to="/app/profile" replace /></ProtectedRoute>} />
//           <Route path="/settings"       element={<ProtectedRoute><Navigate to="/app/settings" replace /></ProtectedRoute>} />
//           <Route path="/users"          element={<ProtectedRoute><Navigate to="/app/users" replace /></ProtectedRoute>} />
//           <Route path="/subscription"   element={<ProtectedRoute><Navigate to="/app/subscription" replace /></ProtectedRoute>} />

//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </ToastProvider>
//     </AuthProvider>
//   )
// }
import EquipeDashboard       from './pages/EquipeDashboard'
import EquipeTimeline        from './pages/equipe/EquipeTimeline'
import EquipeOCR             from './pages/equipe/EquipeOCR'
import EquipeReimbHistory    from './pages/equipe/EquipeReimbHistory'
import EquipeReports         from './pages/equipe/EquipeReports'
import EquipeTemplates       from './pages/equipe/EquipeTemplates'
import EquipeMissions        from './pages/equipe/EquipeMissions'
import EquipeChat from './pages/equipe/EquipeChat'
import EquipeMonthlySummary  from './pages/equipe/EquipeMonthlySummary'
import EquipeBudgetAlerts    from './pages/equipe/EquipeBudgetAlerts'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import Layout              from './components/Layout'
import LandingPage         from './pages/LandingPage'
import LoginPage           from './pages/LoginPage'
import RegisterPage        from './pages/RegisterPage'
import DashboardPage       from './pages/DashboardPage'
import ExpensesPage        from './pages/ExpensesPage'
import NewExpensePage      from './pages/NewExpensePage'
import ExpenseDetailPage   from './pages/ExpenseDetailPage'
import ValidationPage      from './pages/ValidationPage'
import BudgetsPage         from './pages/BudgetsPage'
import ReimbursementsPage       from './pages/ReimbursementsPage'
import ReimbursementDetailPage  from './pages/ReimbursementDetailPage'
import ReportsPage              from './pages/ReportsPage'
import ProfilePage         from './pages/ProfilePage'
import SettingsPage        from './pages/SettingsPage'
import CategoriesPage      from './pages/CategoriesPage'
import UsersPage           from './pages/UsersPage'
import PricingPage         from './pages/PricingPage'
import SubscriptionPage    from './pages/SubscriptionPage'
import PaymentPage         from './pages/PaymentPage'
import { SubscriptionProvider } from './contexts/SubscriptionContext'
import CustomersPage       from './pages/CustomersPage'
import SuppliersPage       from './pages/SuppliersPage'
import QuotesPage          from './pages/QuotesPage'
import StockPage           from './pages/StockPage'
import IncomePage          from './pages/IncomePage'
// Accounting module
import AccountingDashboard from './pages/accounting/AccountingDashboard'
import JournalPage         from './pages/accounting/JournalPage'
import LedgerPage          from './pages/accounting/LedgerPage'
import BalancePage         from './pages/accounting/BalancePage'
import BilanPage           from './pages/accounting/BilanPage'
import CpcPage             from './pages/accounting/CpcPage'
import InvoicesPage        from './pages/accounting/InvoicesPage'
import TaxesPage           from './pages/accounting/TaxesPage'
import PaymentsPage        from './pages/accounting/PaymentsPage'

function Loader() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 16, background: 'var(--cream)',
    }}>
      {/* Logo mark */}
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(61,90,128,0.28)',
        marginBottom: 4,
      }}>
        <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, letterSpacing: '.04em' }}>EQ</span>
      </div>

      {/* Spinner */}
      <div style={{
        width: 24, height: 24, borderRadius: '50%',
        border: '2px solid var(--pearl)',
        borderTopColor: 'var(--accent)',
        animation: 'spin 0.7s linear infinite',
      }} />

      <p style={{ fontSize: 12.5, color: 'var(--silver)', letterSpacing: '0.04em' }}>Chargement…</p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  return user ? children : <Navigate to="/login" replace />
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  return user ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* Public */}
          <Route path="/"        element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />

          {/* Auth */}
          <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

          {/* App protégée */}
          <Route path="/app" element={<ProtectedRoute><SubscriptionProvider><Layout /></SubscriptionProvider></ProtectedRoute>}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard"      element={<DashboardPage />} />
            <Route path="expenses"       element={<ExpensesPage />} />
            <Route path="expenses/new"   element={<NewExpensePage />} />
            <Route path="expenses/:id"   element={<ExpenseDetailPage />} />
            <Route path="validation"     element={<ValidationPage />} />
            <Route path="budgets"        element={<BudgetsPage />} />
            <Route path="reimbursements"     element={<ReimbursementsPage />} />
            <Route path="reimbursements/:id" element={<ReimbursementDetailPage />} />
            <Route path="reports"        element={<ReportsPage />} />
            <Route path="profile"        element={<ProfilePage />} />
            <Route path="settings"       element={<SettingsPage />} />
            <Route path="categories"     element={<CategoriesPage />} />
            <Route path="users"          element={<UsersPage />} />
            <Route path="subscription"   element={<SubscriptionPage />} />
            <Route path="pricing"        element={<PricingPage />} />
            <Route path="payment"        element={<PaymentPage />} />
            <Route path="customers"      element={<CustomersPage />} />
            <Route path="suppliers"      element={<SuppliersPage />} />
            <Route path="quotes"         element={<QuotesPage />} />
            <Route path="stock"          element={<StockPage />} />
            <Route path="incomes"        element={<IncomePage />} />
            {/* ===== ESPACE ÉQUIPE ===== */}
<Route path="equipe/dashboard"        element={<EquipeDashboard />} />
<Route path="equipe/timeline"         element={<EquipeTimeline />} />
<Route path="equipe/remboursements"   element={<EquipeReimbHistory />} />
<Route path="equipe/templates"        element={<EquipeTemplates />} />
<Route path="equipe/missions"         element={<EquipeMissions />} />
<Route path="equipe/resume-mensuel"   element={<EquipeMonthlySummary />} />
<Route path="equipe/alertes-budget"   element={<EquipeBudgetAlerts />} />
            {/* Accounting module */}
            <Route path="accounting"              element={<AccountingDashboard />} />
            <Route path="accounting/journal"      element={<JournalPage />} />
            <Route path="accounting/ledger"       element={<LedgerPage />} />
            <Route path="accounting/balance"      element={<BalancePage />} />
            <Route path="accounting/bilan"        element={<BilanPage />} />
            <Route path="accounting/cpc"          element={<CpcPage />} />
            <Route path="accounting/invoices"     element={<InvoicesPage />} />
            <Route path="accounting/taxes"        element={<TaxesPage />} />
            <Route path="accounting/payments"     element={<PaymentsPage />} />
          </Route>
          {/* Redirects de compatibilité */}
          <Route path="/dashboard"    element={<ProtectedRoute><Navigate to="/app/dashboard" replace /></ProtectedRoute>} />
          <Route path="/expenses"     element={<ProtectedRoute><Navigate to="/app/expenses" replace /></ProtectedRoute>} />
          <Route path="/validation"   element={<ProtectedRoute><Navigate to="/app/validation" replace /></ProtectedRoute>} />
          <Route path="/budgets"      element={<ProtectedRoute><Navigate to="/app/budgets" replace /></ProtectedRoute>} />
          <Route path="/profile"      element={<ProtectedRoute><Navigate to="/app/profile" replace /></ProtectedRoute>} />
          <Route path="/settings"     element={<ProtectedRoute><Navigate to="/app/settings" replace /></ProtectedRoute>} />
          <Route path="/users"        element={<ProtectedRoute><Navigate to="/app/users" replace /></ProtectedRoute>} />
          <Route path="/subscription" element={<ProtectedRoute><Navigate to="/app/subscription" replace /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  )
}