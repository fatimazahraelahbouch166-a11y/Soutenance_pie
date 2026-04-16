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
    Schema::create('products', function (Blueprint $table) {
        $table->id();

        $table->foreignId('company_id')
            ->constrained()
            ->cascadeOnDelete();

        $table->string('ref')->unique();
        $table->string('name');
        $table->string('category')->nullable();

        $table->decimal('buy_price', 12, 2)->default(0);
        $table->decimal('sell_price', 12, 2)->default(0);
        $table->integer('tva')->default(20);

        $table->string('unit')->nullable();

        $table->integer('stock')->nullable();
        $table->integer('min_stock')->nullable();

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
