<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->unsignedBigInteger('manager_id')->nullable(); // FK ajoutée après users
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('teams'); }
};