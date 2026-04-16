<?php
namespace App\Http\Middleware;

use Closure;
use Exception;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class JwtMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json(['message' => 'Utilisateur introuvable.'], 401);
            }
            if (!$user->is_active) {
                return response()->json(['message' => 'Compte désactivé.'], 403);
            }
        } catch (TokenExpiredException $e) {
            return response()->json(['message' => 'Token expiré.'], 401);
        } catch (TokenInvalidException $e) {
            return response()->json(['message' => 'Token invalide.'], 401);
        } catch (Exception $e) {
            return response()->json(['message' => 'Token absent ou malformé.'], 401);
        }

        return $next($request);
    }
}