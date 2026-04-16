<?php
// ══════════════════════════════════════════════════════════════
// MIGRATIONS — ExpenseIQ
// Exécuter dans l'ordre : php artisan migrate --seed
// ══════════════════════════════════════════════════════════════

// ── 2024_01_01_000001_create_companies_table.php ──────────────
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('currency', 10)->default('MAD');
            $table->string('timezone', 60)->default('Africa/Casablanca');
            // Informations légales marocaines
            $table->string('ice', 20)->nullable();
            $table->string('if_num', 20)->nullable();
            $table->string('rc', 50)->nullable();
            $table->string('cnss', 20)->nullable();
            // Limites de validation
            $table->decimal('limit_manager', 12, 2)->default(5000);
            $table->decimal('limit_admin', 12, 2)->default(20000);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('companies'); }
};