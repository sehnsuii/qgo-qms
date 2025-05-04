import React, { useState, useEffect } from 'react';

const QueueDisplay = () => {
  const [counters, setCounters] = useState([]);
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true); // For initial load
  const [isUpdating, setIsUpdating] = useState(false); // For background updates
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const fetchData = async () => {
      if (counters.length === 0 && queues.length === 0) {
        setLoading(true);
      } else {
        setIsUpdating(true);
      }
      setError(null);
      try {
        const [countersResponse, queuesResponse] = await Promise.all([
          fetch('/api/counters'),
          fetch('/api/queues?status=Now Serving,Waiting') // Fetch only relevant queues
        ]);

        if (!countersResponse.ok) {
          throw new Error(`Counters API error! status: ${countersResponse.status}`);
        }
        if (!queuesResponse.ok) {
          throw new Error(`Queues API error! status: ${queuesResponse.status}`);
        }

        const countersData = await countersResponse.json();
        const queuesData = await queuesResponse.json();

        console.log('Counters Data:', countersData);
        console.log('Queues Data:', queuesData);

        setCounters(countersData || []);
        setQueues(queuesData.data || []);
      } catch (err) {
        console.error('Error fetching display data:', err);
        setError(err.message);
      } finally {
        setLoading(false); // Ensure initial loading is off
        // End background update indication shortly after state update
        // Use timeout to allow React to render new state before removing opacity effect
        setTimeout(() => setIsUpdating(false), 150); // Adjust timeout duration if needed
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Poll every 10 seconds

    return () => {
      clearInterval(timer);
      clearInterval(interval);
    };
  }, []);

  // Get the list of waiting queues, sorted by creation time
  const waitingQueues = queues
    .filter(q => q.status === 'Waiting')
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

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

      {/* Main Display - Add relative positioning and transition */}
      <div className={`bg-white p-6 rounded-b-lg shadow-lg relative transition-opacity duration-150 ${isUpdating ? 'opacity-75' : 'opacity-100'}`}>
        {/* Optional: Small updating indicator */}
        {isUpdating && !loading && (
           <div className="absolute top-2 right-2 text-xs text-gray-400 animate-pulse">Updating...</div>
        )}

        {loading ? ( // Only shows on initial load now
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-lg">Loading display data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : (
          <div className="flex gap-6">
            {/* Counters Section */}
            <div className="w-2/3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {counters.map((counter) => {
                const servingQueue = counter.queue; // Queue is directly loaded onto counter object
                return (
                  <div key={counter.id} className="bg-gray-50 p-6 rounded-lg border-2 border-blue-200 flex flex-col">
                    <div className="text-center mb-4">
                      <div className="bg-blue-600 text-white text-2xl font-bold py-2 px-6 rounded-full inline-block">
                        Counter {counter.id} {/* Display Counter ID */}
                      </div>
                    </div>
                    <div className="flex-grow flex flex-col items-center justify-center">
                      {servingQueue ? (
                        <>
                          <div className="text-center text-gray-600 mb-2 text-sm">NOW SERVING</div>
                          <div className="bg-red-600 text-white text-5xl font-bold text-center py-4 px-2 rounded-lg w-full animate-pulse mb-2">
                            {servingQueue.queue_number}
                          </div>
                          <div className="text-lg text-center font-medium truncate w-full" title={servingQueue.service?.name}>
                            {servingQueue.service?.name}
                          </div>
                          <div className="text-xs text-center text-gray-500">
                            ({servingQueue.customer_type})
                          </div>
                        </>
                      ) : (
                        <div className="text-center text-gray-400 text-xl italic">
                          Available
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Waiting List Section */}
            <div className="w-1/3 bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-center mb-4 text-gray-700">Waiting</h3>
              <div className="space-y-3">
                {waitingQueues.length > 0 ? (
                  waitingQueues.slice(0, 10).map((queue, index) => ( // Show top 10 waiting
                    <div
                      key={queue.id}
                      className={`p-3 rounded-lg text-center ${index === 0 ? 'bg-yellow-100 border border-yellow-300' : 'bg-gray-100'}`}
                    >
                      <div className="text-2xl font-bold text-gray-800">{queue.queue_number}</div>
                      <div className="text-xs text-gray-600 mt-1 truncate" title={`${queue.customer_type} - ${queue.service?.name}`}>
                        {queue.customer_type} - {queue.service?.name}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 italic">No customers waiting.</p>
                )}
              </div>
            </div>
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