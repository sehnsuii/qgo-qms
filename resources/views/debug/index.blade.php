<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Debug View</title>
  @vite(['resources/css/app.css'])
</head>

<body>
  <h1>Debug View</h1>
  <p>This is a debug view for testing purposes.</p>
</body>

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
      </div>
    </li>
  @endforeach
</ul>

</html>
