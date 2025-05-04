<?php

namespace App\Http\Controllers;

use App\Models\Services;
use Illuminate\Http\Request;

class ServicesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $services = Services::select('id', 'name')->orderBy('name')->get();
        return response()->json(['services' => $services]);
    }
}
