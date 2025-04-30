import React, { useState, useEffect } from 'react';

const QueueDisplay = () => {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Fetch queues with counter_id
    const fetchQueues = async () => {
      try {
        const response = await fetch('/api/queuing?has_counter=true');
        const data = await response.json();
        console.log(data)
        setQueues(data);
      } catch (error) {
        console.error('Error fetching queues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQueues();
    const interval = setInterval(fetchQueues, 10000); // Refresh every 10 seconds

    return () => {
      clearInterval(timer);
      clearInterval(interval);
    };
  }, []);

  // Group queues by counter_id
  const queuesByCounter = queues.reduce((acc, queue) => {
    const counterName = queue.counter?.name || 'Unassigned';
    if (!acc[counterName]) {
      acc[counterName] = [];
    }
    acc[counterName].push(queue);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="bg-blue-800 text-white p-6 rounded-t-lg shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <img 
              src="https://cityofsanpedrolaguna.gov.ph/wp-content/uploads/2023/02/logo-sanpedro.png" 
              alt="City Logo" 
              className="h-16 inline-block mr-4"
            />
            <h1 className="text-4xl font-bold inline-block align-middle">
              City of San Pedro Laguna
            </h1>
          </div>
          <div className="text-right">
            <div className="text-3xl font-mono">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-xl">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Display */}
      <div className="bg-white p-6 rounded-b-lg shadow-lg">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-lg">Loading queue information...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(queuesByCounter).map(([counterName, counterQueues]) => (
              <div key={counterName} className="bg-gray-50 p-6 rounded-lg border-2 border-blue-200">
                <div className="text-center mb-6">
                  <div className="bg-blue-600 text-white text-2xl font-bold py-2 px-6 rounded-full inline-block">
                    {counterName}
                  </div>
                </div>

                {/* Now Serving */}
                {counterQueues.filter(q => q.status === 'Now Serving').length > 0 && (
                  <div className="mb-8">
                    <div className="text-center text-gray-600 mb-2">NOW SERVING</div>
                    <div className="bg-red-600 text-white text-5xl font-bold text-center py-6 rounded-lg animate-pulse">
                      {counterQueues.find(q => q.status === 'Now Serving')?.queue_no}
                    </div>
                    <div className="text-xl text-center mt-2 font-medium">
                        {counterQueues.find(q => q.status === 'Now Serving')?.appointment_type}
                      </div>
                      <div className="text-sm text-center mt-1">
                        ({counterQueues.find(q => q.status === 'Now Serving')?.customer_type})
                      </div>
                  </div>
                )}

                {/* Next Queues */}
                <div className="space-y-4">
                  <div className="text-center text-gray-600 mb-2">NEXT QUEUES</div>
                  {counterQueues
                    .filter(q => q.status === 'Waiting')
                    .slice(0, 3) // Show only next 3 queues
                    .map((queue, index) => (
                      <div 
                        key={queue.id} 
                        className={`p-4 rounded-lg text-center ${index === 0 ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-gray-100'}`}
                      >
                        <div className="text-3xl font-bold text-gray-800">{queue.queue_no}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {queue.customer_type === 'priority' ? 'Priority' : 'Regular'} - {queue.appointment_type}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-gray-600 text-sm">
        <p>Please wait for your number to be called. Thank you for your patience.</p>
        <p className="mt-2">© {new Date().getFullYear()} City of San Pedro Laguna - Queue Management System</p>
      </div>
    </div>
  );
};

export default QueueDisplay;