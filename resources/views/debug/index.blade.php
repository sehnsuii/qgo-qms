<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Debug View</title>
  @vite(['resources/css/app.css'])
</head>

<body>
  @if (session('success'))
    <div class="alert alert-success" role="alert">
      {{ session('success') }}
      <p>This is a sample success message!</p>
    </div>
  @endif
  <h1>Debug View</h1>
  <p>This is a debug view for testing purposes.</p>

  <div class="mb-4">
    {{ $queues->links() }}
  </div>

  <ul>
    @foreach ($queues as $queue)
      <li class='list-none'>
        <div class="border p-4 rounded shadow-sm">
          <div class='mb-4'>
            <strong>Created At:</strong> {{ $queue->created_at }}<br>
            <strong>Updated At:</strong> {{ $queue->updated_at }}<br>
          </div>
          <div>
            <strong>Queue Number:</strong> {{ $queue->queue_number }}<br>
            <strong>Queue Status:</strong> {{ $queue->status }}<br>
            <strong>Service Type:</strong> {{ $queue->service->name }}<br>
            <strong>Service Description:</strong> {{ $queue->service->description }}<br>
            <strong>Counter:</strong> {{ $queue->counter_id }}<br>
          </div>
          <div class="mt-2 flex flex-row gap-2">
            <form method="POST" action="{{ route('queues.wait', $queue) }}">
              @csrf
              @method('PATCH')
              <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                Change Status to 'Waiting' (Current: {{ $queue->status }})
              </button>
            </form>
            <form method="POST" action="{{ route('queues.serve', $queue) }}">
              @csrf
              @method('PATCH')
              <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                Change Status to 'Now Serving' (Current: {{ $queue->status }})
              </button>
            </form>
            <form method="POST" action="{{ route('queues.complete', $queue) }}">
              @csrf
              @method('PATCH')
              <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                Change Status to 'Completed' (Current: {{ $queue->status }})
              </button>
            </form>
            <form method="POST" action="{{ route('queues.cancel', $queue) }}">
              @csrf
              @method('PATCH')
              <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                Change Status to 'Cancelled' (Current: {{ $queue->status }})
              </button>
            </form>
          </div>
        </div>
      </li>
    @endforeach
  </ul>
</body>

</html>
