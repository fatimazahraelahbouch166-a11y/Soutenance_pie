# ExpenseIQ — Frontend React complet

## Stack
React 18 · Vite · Tailwind CSS 3 · React Router v6 · Axios · Recharts · Lucide React

## Installation

```bash
npm install
cp .env.example .env
# Modifier VITE_API_URL selon votre backend
npm run dev   # → http://localhost:5173
npm run build # Production
```

## Structure complète
```
src/
├── main.jsx
├── App.jsx                     ← Routes + guards auth
├── index.css                   ← Tailwind + classes utilitaires
├── lib/
│   ├── api.js                  ← Axios + intercepteurs token
│   └── helpers.js              ← fmt(), fmtDate(), initials()
├── contexts/
│   └── AuthContext.jsx         ← login / register / logout / user
├── components/
│   ├── AuthLayout.jsx          ← Wrapper pages publiques
│   ├── Layout.jsx              ← Shell app connectée
│   ├── Sidebar.jsx             ← Navigation latérale
│   ├── Topbar.jsx              ← Barre supérieure
│   ├── StatusBadge.jsx         ← Badge statut dépense
│   ├── KpiCard.jsx             ← Carte indicateur
│   └── Spinner.jsx             ← Loading
└── pages/
    ├── LoginPage.jsx           ← Connexion
    ├── RegisterPage.jsx        ← Inscription 2 étapes
    ├── DashboardPage.jsx       ← KPIs + graphiques Recharts
    ├── ExpensesPage.jsx        ← Liste + tabs + pagination
    ├── NewExpensePage.jsx      ← Formulaire + upload justificatif
    ├── ExpenseDetailPage.jsx   ← Détail + approuver/refuser
    ├── ValidationPage.jsx      ← File de validation manager
    ├── BudgetsPage.jsx         ← Suivi budgets + barres
    ├── ReimbursementsPage.jsx  ← Traitement remboursements
    └── ReportsPage.jsx         ← Graphiques annuels + catégories + équipes
```

## Routes
| Route             | Page              | Protection |
|-------------------|-------------------|------------|
| /login            | LoginPage         | Guest only |
| /register         | RegisterPage      | Guest only |
| /dashboard        | DashboardPage     | Auth       |
| /expenses         | ExpensesPage      | Auth       |
| /expenses/new     | NewExpensePage    | Auth       |
| /expenses/:id     | ExpenseDetailPage | Auth       |
| /validation       | ValidationPage    | Auth       |
| /budgets          | BudgetsPage       | Auth       |
| /reimbursements   | ReimbursementsPage| Auth       |
| /reports          | ReportsPage       | Auth       |

## API Backend attendue (Laravel)
```
POST /api/login
POST /api/register
POST /api/logout
GET  /api/me
GET  /api/dashboard
GET  /api/expenses
POST /api/expenses
GET  /api/expenses/:id
PATCH /api/expenses/:id
DELETE /api/expenses/:id
POST /api/expenses/:id/submit
POST /api/expenses/:id/approve
POST /api/expenses/:id/reject
GET  /api/budgets
POST /api/budgets
GET  /api/reimbursements
POST /api/reimbursements/:id/mark-paid
GET  /api/reports/monthly
GET  /api/reports/by-category
GET  /api/reports/by-team
GET  /api/categories
GET  /api/teams
```
