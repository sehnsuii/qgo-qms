<?php

use App\Models\Counters;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->redirectGuestsTo(function (\Illuminate\Http\Request $request) {
            if ($request->is('counter/*') && !$request->is('counter/*/login')) {
                $segments = $request->segments();
                if (isset($segments[1]) && is_numeric($segments[1])) {
                    $counterId = $segments[1];
                    if (Counters::find($counterId)) {
                        return route('counter.login.create', ['counter' => $counterId]);
                    }
                }
            }
            return route('login');
        });
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
