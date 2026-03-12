<?php

namespace App\Http\Controllers;

use App\Actions\Orders\CreateOrder;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Orders/Index');
    }

    public function create(): Response
    {
        return Inertia::render('Orders/Create');
    }

    public function store(StoreOrderRequest $request, CreateOrder $createOrder): RedirectResponse
    {
        $order = $createOrder->handle(
            $request->string('customer_name')->toString(),
            $request->validated('items'),
        );

        return redirect()->route('orders.show', $order);
    }

    public function show(Order $order): Response
    {
        return Inertia::render('Orders/Show', [
            'orderId' => $order->id,
        ]);
    }
}
