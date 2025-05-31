<?php

namespace App\Http\Controllers;

use App\Models\Services;
use Illuminate\Http\Request;

class ServicesController extends Controller
{

    public function index()
    {
        $services = Services::select('id', 'name')->orderBy('name')->get();
        return response()->json(['services' => $services]);
    }
}
