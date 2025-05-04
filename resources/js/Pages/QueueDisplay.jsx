import QueueDisplayLayout from '@/Layouts/QueueDisplayLayout';
import { useEffect, useState } from 'react';
import CounterListItem from './QueueDisplay/CounterListItem';
import WaitingListItem from './QueueDisplay/WaitingListItem';

const QueueDisplay = () => {
  const [counters, setCounters] = useState([]);
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
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
        const [countersResponse, queuesResponse] = await Promise.all([fetch('/api/counters'), fetch('/api/queues?status=Now Serving,Waiting')]);

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
        setLoading(false);
        setTimeout(() => setIsUpdating(false), 150);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Poll every 10 seconds

    return () => {
      clearInterval(timer);
      clearInterval(interval);
    };
  }, []);

  const waitingQueues = queues.filter((q) => q.status === 'Waiting').sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  return (
    <QueueDisplayLayout currentTime={currentTime}>
      <div className={`relative flex min-h-full flex-grow flex-col rounded-xl bg-white p-6 shadow-lg transition-opacity duration-150 ${isUpdating ? 'opacity-75' : 'opacity-100'}`}>
        {isUpdating && !loading && <div className='absolute right-2 top-2 animate-pulse text-xs text-gray-400'>Updating...</div>}

        {loading ? (
          <div className='flex h-full items-center justify-center py-16 text-center'>
            <div>
              <div className='inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500'></div>
              <p className='mt-4 text-lg'>Loading display data...</p>
            </div>
          </div>
        ) : error ? (
          <div
            className='relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700'
            role='alert'
          >
            <strong className='font-bold'>Error:</strong>
            <span className='block sm:inline'> {error}</span>
          </div>
        ) : (
          <div className='flex h-full flex-grow gap-6'>
            <div className='grid w-3/4 grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {counters.map((counter) => (
                <CounterListItem
                  key={counter.id}
                  counter={counter}
                />
              ))}
            </div>
            <div className='w-1/4 rounded-xl border-2 border-gray-200 bg-gray-50 p-6 shadow-xl'>
              <h3 className='mb-4 text-center text-2xl font-bold text-gray-700'>Waiting</h3>
              <div className='space-y-3'>
                {waitingQueues.length > 0 ? (
                  waitingQueues.slice(0, 10).map((queue, index) => (
                    <WaitingListItem
                      key={queue.id}
                      queue={queue}
                      isFirst={index === 0}
                    />
                  ))
                ) : (
                  <p className='text-center italic text-gray-500'>No customers waiting.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </QueueDisplayLayout>
  );
};

export default QueueDisplay;
