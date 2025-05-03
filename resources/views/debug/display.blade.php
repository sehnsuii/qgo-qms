<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TV Display</title>
  @vite(['resources/css/app.css'])
</head>

<body>
  @foreach ($counters as $counter)
    <div class="flex align-center justify-center bg-gray-800 p-4 rounded shadow-sm mb-4">
      <p>
        <strong>Counter</strong>{{ $counter->id }}
        <br>
        <strong>Counter is</strong>
        @if ($counter->status == 'ready')
          <span class="text-green-500">{{ $counter->status }}</span>
        @elseif ($counter->status == 'busy')
          <span class="text-blue-500">{{ $counter->status }}</span>
        @elseif ($counter->status == 'offline')
          <span class="text-gray-500">{{ $counter->status }}</span>
        @endif
        <br>
        <strong>Queue Number:</strong>
        @if ($counter->queue_id == null)
          <span class="text-gray-500">No queue assigned</span>
        @else
          {{ $counter->queue }}
        @endif
      </p>
      <a href="{{ route('debug.counter', $counter) }}" class="text-blue-500 hover:underline" target="_blank">View
        Details</a>
    </div>
  @endforeach
</body>

</html>
