<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Form</title>
  @vite(['resources/css/app.css'])
</head>

<body class="p-6">
  <form method="POST" action="{{ route('queues.store.debug') }}">
    @csrf
    <div class="mb-4">
      <label for="created_at" class="block mb-2">Created At:</label>
      <input type="datetime-local" name="created_at" id="created_at" class="border rounded p-2 w-full bg-gray-800">
    </div>
    <div class="mb-4">
      <label for="customer_type" class="block mb-2">Customer Type:</label>
      <select name="customer_type" id="customer_type" class="border rounded p-2 w-full bg-gray-800" required>
        <option value="Regular">Regular</option>
        <option value="Priority">Priority</option>
      </select>
    </div>
    <div class="mb-4">
      <label for="service_id" class="block mb-2">Service:</label>
      <select name="service_id" id="service_id" class="border rounded p-2 w-full bg-gray-800" required>
        @foreach ($services as $service)
          <option value="{{ $service->id }}">{{ $service->name }}</option>
        @endforeach
      </select>
    </div>

    <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">New Queue</button>
</body>

</html>
