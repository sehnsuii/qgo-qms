<?php

namespace App\Http\Controllers;

use App\Models\Counters;
use Illuminate\Http\Request;

class CounterController extends Controller
{
    public function display()
    {
        $counters = Counters::all();
        return view('debug.display', ['counters' => $counters]);
    }
}
