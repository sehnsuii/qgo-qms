<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Print Queue</title>
  @vite(['resources/css/app.css'])
</head>

<body class='font-sans text-center p-6'>
  <div class="border-2 border-dashed border-gray-500 p-6 rounded-lg max-w-sm mx-auto">
    <div class="text-sm mb-4">{{ $queue->created_at->format('F d, Y h:i A') }}</div>
    <div class="align-center">
      <img class="mb-4 mx-auto w-auto h-32" src="https://cityofsanpedrolaguna.gov.ph/wp-content/uploads/2023/02/logo-sanpedro.png" alt="Logo">
      <h1 class="text-2xl md:text-2xl font-bold">City of San Pedro Laguna</h1>
    </div>
    <div class="text-xl">Queue Ticket</div>
    <div class="my-6 text-6xl font-bold text-blue-600">Q-{{ $queue->queue_number }}</div>
    <div class="text-2xl">{{ $queue->service->name }}</div>
    @if ($queue->customer_type == 'Priority')
      <div class="text-xl text-red-600 font-bold">{{ $queue->customer_type }}</div>
    @elseif ($queue->customer_type == 'Regular')
      <div class="text-xl text-green-600 font-bold">{{ $queue->customer_type }}</div>
    @endif

  </div>
  <script>
    window.print();
  </script>
</body>

</html>
