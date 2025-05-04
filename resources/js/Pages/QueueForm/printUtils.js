export const printQueueTicket = (queueNumber, customerType, serviceName) => {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
        <html>
            <head>
                <title>Queue Ticket</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
                    .ticket { border: 2px dashed #000; padding: 20px; max-width: 300px; margin: 0 auto; }
                    .queue-number { font-size: 24px; font-weight: bold; margin: 10px 0; color: #2563eb; }
                    .info { margin: 5px 0; }
                    .header { margin-bottom: 15px; }
                </style>
            </head>
            <body>
                <div class="ticket">
                    <div class="header">
                        <img src="https://cityofsanpedrolaguna.gov.ph/wp-content/uploads/2023/02/logo-sanpedro.png" width="80" alt="Logo">
                        <h2>City of San Pedro Laguna</h2>
                    </div>
                    <div class="info">Queue Ticket</div>
                    <div class="queue-number">Q-${queueNumber}</div>
                    <div class="info">Customer Type: ${customerType}</div>
                    <div class="info">Service: ${serviceName}</div>
                    <div class="info">Date: ${new Date().toLocaleString()}</div>
                </div>
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                            window.close();
                        }, 200);
                    }
                </script>
            </body>
        </html>
    `);
  printWindow.document.close();
};
