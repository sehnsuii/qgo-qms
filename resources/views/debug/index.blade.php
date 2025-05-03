<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard</title>
  @vite(['resources/css/app.css'])
</head>

<body class="p-6">
  @if (session('success'))
    <div class="flex align-center justify-center bg-gray-800 p-4 rounded shadow-sm mb-4">
      <div class="alert alert-success" role="alert">
        {{ session('success') }}
      </div>
    </div>
  @endif

  <nav>
    <a class='bg-gray-800 rounded shadow-sm p-4 m-4' href='{{ route('debug.form') }}' target="_blank">Create New Queue</a>
    <a class='bg-gray-800 rounded shadow-sm p-4 m-4' href='{{ route('debug.display') }}' target="_blank">TV Display</a>
  </nav>

  <div class="mb-4">
    {{ $queues->links() }}
  </div>

  <ul>
    @foreach ($queues as $queue)
      <li class='list-none'>
        <div class="border p-4 rounded shadow-sm">


          <div class='flex flex-row align-center justify-between'>
            <div>
              <strong>Created At:</strong> {{ $queue->created_at }}<br>
              <strong>Updated At:</strong> {{ $queue->updated_at }}<br>
              <strong>Queue Number:</strong> {{ $queue->queue_number }}<br>
              @if ($queue->status == 'Waiting')
                <strong>Queue Status:</strong> <span class="text-yellow-500">{{ $queue->status }}</span><br>
              @elseif ($queue->status == 'Now Serving')
                <strong>Queue Status:</strong> <span class="text-green-500">{{ $queue->status }}</span><br>
              @elseif ($queue->status == 'Completed')
                <strong>Queue Status:</strong> <span class="text-blue-500">{{ $queue->status }}</span><br>
              @elseif ($queue->status == 'Cancelled')
                <strong>Queue Status:</strong> <span class="text-gray-500">{{ $queue->status }}</span><br>
              @endif
              <strong>Service Type:</strong> {{ $queue->service->name }}<br>
            </div>

            <div class="flex flex-col">
              <div class="flex flex-row gap-2">
                <form method="POST" action="{{ route('queues.wait', $queue) }}">
                  @csrf
                  @method('PATCH')
                  <button type="submit" class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700">
                    Change Status to Waiting
                  </button>
                </form>
                <form method="POST" action="{{ route('queues.serve', $queue) }}">
                  @csrf
                  @method('PATCH')
                  <button type="submit" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">
                    Change Status to Now Serving
                  </button>
                </form>
              </div>
              <div class="flex flex-row gap-2">
                <form method="POST" action="{{ route('queues.complete', $queue) }}">
                  @csrf
                  @method('PATCH')
                  <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                    Change Status to Completed
                  </button>
                </form>
                <form method="POST" action="{{ route('queues.cancel', $queue) }}">
                  @csrf
                  @method('PATCH')
                  <button type="submit" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700">
                    Change Status to Cancelled
                  </button>
                </form>
              </div>
            </div>
          </div>


        </div>
      </li>
    @endforeach
  </ul>
</body>

</html>
