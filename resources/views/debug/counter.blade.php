<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Counter</title>
  @vite(['resources/css/app.css'])
</head>

<body class="p-6 bg-gray-800 text-white">
  <h1>
    Counter #{{ $counter->id }}
  </h1>
  @if (!$counter->queue)
    <p>
      No queue assigned
    </p>
  @else
    <p>
      Serving Q-{{ $counter->queue->queue_number }}<br>
      Customer Type: {{ $counter->queue->customer_type }}<br>
      Service: {{ $counter->queue->service->name }}<br>
    </p>

    <div class="flex flex-col">
      <div class="flex flex-row gap-2">
        <form method="POST" action="{{ route('debug.counter.wait', $counter) }}">
          @csrf
          @method('PATCH')
          <button type="submit" class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700">
            Change Status to Waiting
          </button>
        </form>
        <form method="POST" action="{{ route('debug.counter.complete', $counter) }}">
          @csrf
          @method('PATCH')
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
            Change Status to Completed
          </button>
        </form>
        <form method="POST" action="{{ route('debug.counter.cancel', $counter) }}">
          @csrf
          @method('PATCH')
          <button type="submit" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700">
            Change Status to Cancelled
          </button>
        </form>
      </div>
    </div>
  @endif

</body>

</html>
