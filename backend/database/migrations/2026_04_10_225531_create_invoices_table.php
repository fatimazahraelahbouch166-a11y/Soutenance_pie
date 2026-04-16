<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
{
    Schema::create('invoices', function (Blueprint $table) {
        $table->id();

        $table->foreignId('company_id')
            ->constrained()
            ->cascadeOnDelete();

        $table->foreignId('customer_id')
            ->constrained()
            ->cascadeOnDelete();

        $table->foreignId('quote_id')
            ->nullable()
            ->constrained()
            ->nullOnDelete();

        $table->string('ref')->unique();

        $table->date('date');
        $table->date('due_date')->nullable();

        $table->string('status')->default('draft');

        $table->decimal('total_ht', 12, 2)->default(0);
        $table->decimal('total_tva', 12, 2)->default(0);
        $table->decimal('total_ttc', 12, 2)->default(0);

        $table->timestamp('paid_at')->nullable();

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
