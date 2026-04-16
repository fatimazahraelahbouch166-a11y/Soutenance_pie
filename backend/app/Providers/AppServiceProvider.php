<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Schema; // ✅ زيد هادي

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        // ✅ حل مشكل "clé trop longue"
        Schema::defaultStringLength(191);

        // Force HTTPS en production
        if (app()->environment('production')) {
            URL::forceScheme('https');
        }
    }
}