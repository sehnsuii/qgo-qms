import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CounterTable from '@/Pages/Dashboard/CounterTable';
import QueueStats from '@/Pages/Dashboard/QueueStats';
import QueueTable from '@/Pages/Dashboard/QueueTable';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

const defaultStats = {
  total: 0,
  priority: 0,
  waiting: 0,
  serving: 0,
  completed: 0,
  cancelled: 0,
};

export default function Dashboard() {
  const [stats, setStats] = useState(defaultStats);
  const [queueData, setQueueData] = useState([]);
  const [counterData, setCounterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [queuesResponse, countersResponse] = await Promise.all([fetch('/api/queues'), fetch('/api/counters')]);

        if (!queuesResponse.ok || !countersResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const queuesResult = await queuesResponse.json();
        const countersResult = await countersResponse.json();

        setQueueData(queuesResult);
        const mappedQueueData = queuesResult.data.map((q) => ({
          id: q.id,
          queue_no: `Q-${String(q.queue_number)}`,
          customer_type: q.customer_type,
          service_type: q.service ? q.service.name : 'N/A',
          status: q.status,
          timestamp: q.created_at,
        }));
        setQueueData(mappedQueueData);

        const mappedCounterData = countersResult.map((c) => {
          let formattedQueueNo = '-';
          if (c.queue) {
            formattedQueueNo = `Q-${String(c.queue.queue_number)}`;
          }
          return {
            id: c.id,
            status: c.status,
            user_id: c.user_id,
            user_name: c.user ? c.user.name : '-',
            queue_id: c.queue_id,
            queue_no: formattedQueueNo,
          };
        });
        setCounterData(mappedCounterData);
      } catch (err) {
        setError(err.message);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Optional: Set up polling or WebSocket for real-time updates
    const intervalId = setInterval(fetchData, 10000); // Fetch every 10 seconds
    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []); // Empty dependency array means this runs once on mount

  // Calculate stats based on fetched queueData
  const calculatedStats = useMemo(() => {
    if (!queueData || queueData.length === 0) {
      return defaultStats;
    }
    return queueData.reduce(
      (acc, queue) => {
        acc.total += 1;
        if (queue.customer_type === 'Priority') acc.priority += 1;
        if (queue.status === 'Waiting') acc.waiting += 1;
        if (queue.status === 'Now Serving') acc.serving += 1;
        if (queue.status === 'Completed') acc.completed += 1;
        if (queue.status === 'Cancelled') acc.cancelled += 1;
        return acc;
      },
      { ...defaultStats },
    );
  }, [queueData]);

  useEffect(() => {
    setStats(calculatedStats);
  }, [calculatedStats]);

  return (
    <AuthenticatedLayout header={<h2 className='text-xl font-semibold leading-tight text-gray-800'>Admin Dashboard</h2>}>
      <Head title='Dashboard' />
      <div className='py-12'>
        <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
          {loading && <p>Loading dashboard data...</p>}
          {error && <p className='text-red-500'>Error loading data: {error}</p>}
          {!loading && !error && (
            <>
              <QueueStats stats={stats} />
              <CounterTable data={counterData} />
              <QueueTable data={queueData} />
            </>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
