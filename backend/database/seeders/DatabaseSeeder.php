<?php
namespace Database\Seeders;

use App\Models\{Company, User, Team, Category, Expense, Budget, Customer, Supplier, Product, Quote, QuoteItem, Invoice, InvoiceItem};
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Entreprise ────────────────────────────────────────
        $company = Company::create([
            'name'          => 'TechMaroc SARL',
            'email'         => 'contact@techmaroc.ma',
            'phone'         => '+212 5 22 00 00 00',
            'address'       => 'Casablanca, Maroc',
            'currency'      => 'MAD',
            'timezone'      => 'Africa/Casablanca',
            'ice'           => '002345678000056',
            'if_num'        => '12345678',
            'rc'            => '123456 Casablanca',
            'cnss'          => '1234567',
            'limit_manager' => 5000,
            'limit_admin'   => 20000,
        ]);

        // ── Équipes ───────────────────────────────────────────
        $teamDirection  = Team::create(['company_id' => $company->id, 'name' => 'Direction']);
        $teamRD         = Team::create(['company_id' => $company->id, 'name' => 'R&D']);
        $teamCommercial = Team::create(['company_id' => $company->id, 'name' => 'Commercial']);
        $teamMarketing  = Team::create(['company_id' => $company->id, 'name' => 'Marketing']);

        // ── Utilisateurs ──────────────────────────────────────
        $owner = User::create([
            'company_id' => $company->id, 'team_id' => $teamDirection->id,
            'first_name' => 'Sara',   'last_name' => 'Alami',
            'email'      => 'owner@techmaroc.ma', 'password' => 'password',
            'role'       => 'owner', 'is_active' => true,
        ]);
        $chef = User::create([
            'company_id' => $company->id, 'team_id' => $teamRD->id,
            'first_name' => 'Karim',  'last_name' => 'Ouali',
            'email'      => 'chef@techmaroc.ma',  'password' => 'password',
            'role'       => 'chef_equipe', 'is_active' => true,
        ]);
        $leila = User::create([
            'company_id' => $company->id, 'team_id' => $teamRD->id,
            'first_name' => 'Leila',  'last_name' => 'Benali',
            'email'      => 'equipe@techmaroc.ma', 'password' => 'password',
            'role'       => 'equipe', 'is_active' => true,
        ]);
        $amine = User::create([
            'company_id' => $company->id, 'team_id' => $teamCommercial->id,
            'first_name' => 'Amine',  'last_name' => 'Moudni',
            'email'      => 'amine@techmaroc.ma',  'password' => 'password',
            'role'       => 'equipe', 'is_active' => true,
        ]);
        $nadia = User::create([
            'company_id' => $company->id, 'team_id' => $teamMarketing->id,
            'first_name' => 'Nadia',  'last_name' => 'Ziani',
            'email'      => 'nadia@techmaroc.ma',  'password' => 'password',
            'role'       => 'equipe', 'is_active' => true,
        ]);

        // Assigner managers
        $teamRD->update(['manager_id' => $chef->id]);
        $teamDirection->update(['manager_id' => $owner->id]);

        // ── Catégories ────────────────────────────────────────
        $cats = [
            'Déplacement'  => '#6366f1',
            'Hébergement'  => '#10b981',
            'Restauration' => '#f59e0b',
            'Informatique' => '#3b82f6',
            'Formation'    => '#ef4444',
            'Fournitures'  => '#8b5cf6',
        ];
        $catModels = [];
        foreach ($cats as $name => $color) {
            $catModels[$name] = Category::create(['company_id' => $company->id, 'name' => $name, 'color' => $color]);
        }

        // ── Dépenses ──────────────────────────────────────────
        $expenses = [
            ['title' => 'Vol Casablanca–Paris',       'amount' => 4800, 'status' => 'pending',  'user' => $leila, 'team' => $teamRD,         'cat' => 'Déplacement',  'date' => '2025-03-18', 'desc' => 'Mission client Paris', 'project' => 'Projet Atlas'],
            ['title' => 'Hôtel Marriott — 3 nuits',   'amount' => 3600, 'status' => 'approved', 'user' => $leila, 'team' => $teamRD,         'cat' => 'Hébergement',  'date' => '2025-03-15', 'desc' => 'Séjour Paris', 'project' => 'Projet Atlas'],
            ['title' => 'Repas équipe R&D',            'amount' => 1250, 'status' => 'approved', 'user' => $chef,  'team' => $teamRD,         'cat' => 'Restauration', 'date' => '2025-03-12', 'desc' => 'Sprint review', 'project' => ''],
            ['title' => 'Abonnements SaaS mensuels',   'amount' => 2900, 'status' => 'paid',     'user' => $owner, 'team' => $teamDirection,  'cat' => 'Informatique', 'date' => '2025-03-10', 'desc' => 'Figma, Notion, Slack', 'project' => ''],
            ['title' => 'Taxi aéroport',               'amount' =>  320, 'status' => 'pending',  'user' => $amine, 'team' => $teamCommercial, 'cat' => 'Déplacement',  'date' => '2025-03-08', 'desc' => '', 'project' => ''],
            ['title' => 'Formation React avancé',      'amount' => 5400, 'status' => 'pending',  'user' => $leila, 'team' => $teamRD,         'cat' => 'Formation',    'date' => '2025-03-05', 'desc' => 'Formation 3 jours', 'project' => ''],
            ['title' => 'Restaurant client partenaire','amount' => 1100, 'status' => 'pending',  'user' => $chef,  'team' => $teamRD,         'cat' => 'Restauration', 'date' => '2025-03-03', 'desc' => '', 'project' => 'Projet Beta'],
            ['title' => 'Matériel bureau',             'amount' =>  890, 'status' => 'rejected', 'user' => $nadia, 'team' => $teamMarketing,  'cat' => 'Fournitures',  'date' => '2025-02-28', 'desc' => '', 'project' => ''],
            ['title' => 'Licence Adobe Creative',      'amount' => 1800, 'status' => 'approved', 'user' => $nadia, 'team' => $teamMarketing,  'cat' => 'Informatique', 'date' => '2025-02-20', 'desc' => '', 'project' => ''],
            ['title' => 'Billet train Rabat',          'amount' =>  280, 'status' => 'paid',     'user' => $chef,  'team' => $teamRD,         'cat' => 'Déplacement',  'date' => '2025-02-15', 'desc' => '', 'project' => ''],
        ];

        foreach ($expenses as $e) {
            $exp = Expense::create([
                'company_id'   => $company->id,
                'user_id'      => $e['user']->id,
                'team_id'      => $e['team']->id,
                'category_id'  => $catModels[$e['cat']]->id,
                'title'        => $e['title'],
                'amount'       => $e['amount'],
                'expense_date' => $e['date'],
                'description'  => $e['desc'],
                'project'      => $e['project'],
                'status'       => $e['status'],
                'approved_by'  => in_array($e['status'], ['approved','paid','rejected']) ? $owner->id : null,
                'approved_at'  => in_array($e['status'], ['approved','paid','rejected']) ? now() : null,
                'rejection_reason' => $e['status'] === 'rejected' ? 'Budget épuisé.' : null,
            ]);

            if ($e['status'] === 'paid') {
                \App\Models\Reimbursement::create([
                    'expense_id'     => $exp->id,
                    'paid_by'        => $owner->id,
                    'payment_method' => 'Virement bancaire',
                    'paid_at'        => now(),
                ]);
            }
        }

        // ── Budgets ───────────────────────────────────────────
        $budgetData = [
            ['label' => 'Déplacements annuels',       'cat' => 'Déplacement',  'team' => null,           'amount' => 50000],
            ['label' => 'Restauration & Hébergement', 'cat' => 'Restauration', 'team' => null,           'amount' => 30000],
            ['label' => 'IT & SaaS — R&D',            'cat' => 'Informatique', 'team' => $teamRD,        'amount' => 20000],
            ['label' => 'Formation équipe R&D',       'cat' => 'Formation',    'team' => $teamRD,        'amount' => 15000],
            ['label' => 'Marketing & Communication',  'cat' => null,           'team' => $teamMarketing, 'amount' => 25000],
        ];
        foreach ($budgetData as $b) {
            Budget::create([
                'company_id'  => $company->id,
                'category_id' => $b['cat'] ? $catModels[$b['cat']]->id : null,
                'team_id'     => $b['team']?->id,
                'label'       => $b['label'],
                'amount'      => $b['amount'],
                'period'      => 'yearly',
                'start_date'  => '2025-01-01',
                'end_date'    => '2025-12-31',
            ]);
        }

        // ── Clients ERP ───────────────────────────────────────
        $groupeSaham = Customer::create(['company_id' => $company->id, 'name' => 'Groupe Saham',  'type' => 'enterprise', 'ice' => '002345678000056', 'email' => 'contact@saham.ma',   'phone' => '+212 5 22 48 00 00', 'address' => 'Casablanca', 'payment_terms' => 30,  'credit_limit' => 500000,  'balance' => 48000]);
        $marjane     = Customer::create(['company_id' => $company->id, 'name' => 'Marjane',       'type' => 'enterprise', 'ice' => '001234567000012', 'email' => 'achats@marjane.ma',  'phone' => '+212 5 37 71 00 00', 'address' => 'Rabat',       'payment_terms' => 60,  'credit_limit' => 1000000, 'balance' => 125000]);
        $amrani      = Customer::create(['company_id' => $company->id, 'name' => 'Youssef Amrani','type' => 'individual', 'ice' => '',                'email' => 'y.amrani@gmail.com', 'phone' => '+212 6 61 00 00 01', 'address' => 'Fès',         'payment_terms' => 0,   'credit_limit' => 10000,   'balance' => 2500]);

        // ── Fournisseurs ERP ──────────────────────────────────
        Supplier::create(['company_id' => $company->id, 'name' => 'Dell Technologies Maroc', 'category' => 'informatique', 'email' => 'maroc@dell.com',  'phone' => '+212 5 22 36 00 00', 'payment_terms' => 30, 'rating' => 5]);
        Supplier::create(['company_id' => $company->id, 'name' => 'Atlas Fournitures',       'category' => 'fournitures',  'email' => 'cmd@atlas.ma',    'phone' => '+212 5 37 62 00 00', 'payment_terms' => 15, 'rating' => 4]);

        // ── Produits ──────────────────────────────────────────
        $laptop  = Product::create(['company_id' => $company->id, 'ref' => 'INF-001', 'name' => 'Ordinateur portable Dell Latitude', 'category' => 'Informatique', 'buy_price' => 8500,  'sell_price' => 11000, 'tva' => 20, 'unit' => 'pièce',   'stock' => 5,  'min_stock' => 2]);
        $screen  = Product::create(['company_id' => $company->id, 'ref' => 'INF-002', 'name' => 'Écran 24" Full HD',                 'category' => 'Informatique', 'buy_price' => 1800,  'sell_price' => 2500,  'tva' => 20, 'unit' => 'pièce',   'stock' => 8,  'min_stock' => 3]);
        $office  = Product::create(['company_id' => $company->id, 'ref' => 'LOG-001', 'name' => 'Licence Microsoft Office 365',      'category' => 'Logiciels',    'buy_price' => 900,   'sell_price' => 1400,  'tva' => 20, 'unit' => 'licence', 'stock' => 15, 'min_stock' => 5]);
        $paper   = Product::create(['company_id' => $company->id, 'ref' => 'FOR-001', 'name' => 'Ramette papier A4',                 'category' => 'Fournitures',  'buy_price' => 35,    'sell_price' => 55,    'tva' => 20, 'unit' => 'ramette', 'stock' => 1,  'min_stock' => 10]);
        $training= Product::create(['company_id' => $company->id, 'ref' => 'SER-001', 'name' => 'Formation React (jour)',            'category' => 'Services',     'buy_price' => 1500,  'sell_price' => 2800,  'tva' => 20, 'unit' => 'jour',    'stock' => null, 'min_stock' => null]);

        // ── Devis ─────────────────────────────────────────────
        $quote1 = Quote::create(['company_id' => $company->id, 'customer_id' => $groupeSaham->id, 'ref' => 'DEV-2025-001', 'date' => '2025-03-15', 'valid_until' => '2025-04-15', 'status' => 'accepted']);
        QuoteItem::create(['quote_id' => $quote1->id, 'product_id' => $laptop->id, 'name' => $laptop->name, 'qty' => 3, 'unit_price' => 11000, 'tva' => 20, 'discount' => 5]);
        QuoteItem::create(['quote_id' => $quote1->id, 'product_id' => $screen->id, 'name' => $screen->name, 'qty' => 3, 'unit_price' => 2500,  'tva' => 20, 'discount' => 0]);
        $quote1->load('items'); $quote1->recalcTotals();

        $quote2 = Quote::create(['company_id' => $company->id, 'customer_id' => $amrani->id,     'ref' => 'DEV-2025-002', 'date' => '2025-03-20', 'valid_until' => '2025-04-20', 'status' => 'sent']);
        QuoteItem::create(['quote_id' => $quote2->id, 'product_id' => $training->id, 'name' => $training->name, 'qty' => 3, 'unit_price' => 2800, 'tva' => 20, 'discount' => 10]);
        $quote2->load('items'); $quote2->recalcTotals();

        // ── Factures ──────────────────────────────────────────
        $inv1 = Invoice::create(['company_id' => $company->id, 'customer_id' => $groupeSaham->id, 'quote_id' => $quote1->id, 'ref' => 'FAC-2025-001', 'date' => '2025-03-20', 'due_date' => '2025-04-20', 'status' => 'paid', 'paid_at' => now()]);
        InvoiceItem::create(['invoice_id' => $inv1->id, 'product_id' => $laptop->id, 'name' => $laptop->name, 'qty' => 3, 'unit_price' => 11000, 'tva' => 20, 'discount' => 5]);
        InvoiceItem::create(['invoice_id' => $inv1->id, 'product_id' => $screen->id, 'name' => $screen->name, 'qty' => 3, 'unit_price' => 2500,  'tva' => 20, 'discount' => 0]);
        $inv1->load('items'); $inv1->recalcTotals();

        $inv2 = Invoice::create(['company_id' => $company->id, 'customer_id' => $amrani->id, 'ref' => 'FAC-2025-002', 'date' => '2025-03-22', 'due_date' => '2025-03-22', 'status' => 'overdue']);
        InvoiceItem::create(['invoice_id' => $inv2->id, 'name' => 'Maintenance informatique', 'qty' => 4, 'unit_price' => 450, 'tva' => 20, 'discount' => 0]);
        $inv2->load('items'); $inv2->recalcTotals();

        $this->command->info('✅ Base de données seedée avec succès !');
        $this->command->table(
            ['Rôle', 'Email', 'Mot de passe'],
            [
                ['Company Owner', 'owner@techmaroc.ma',  'password'],
                ["Chef d'équipe", 'chef@techmaroc.ma',   'password'],
                ['Équipe',        'equipe@techmaroc.ma', 'password'],
                ['Équipe',        'amine@techmaroc.ma',  'password'],
                ['Équipe',        'nadia@techmaroc.ma',  'password'],
            ]
        );
    }
}