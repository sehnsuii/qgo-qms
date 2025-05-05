import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CounterTable from '@/Pages/Dashboard/CounterTable';
import QueueStats from '@/Pages/Dashboard/QueueStats';
import QueueTable from '@/Pages/Dashboard/QueueTable';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        const [queuesResponse, countersResponse] = await Promise.all([fetch('/api/queues'), fetch('/api/counters')]);

        if (!queuesResponse.ok || !countersResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const queuesResult = await queuesResponse.json();
        const countersResult = await countersResponse.json();

        const statsDataForCalc = queuesResult.data.map((q) => ({
          id: q.id,
          customer_type: q.customer_type,
          status: q.status,
        }));

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

        const calculatedStats = statsDataForCalc.reduce(
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
        setStats(calculatedStats);
      } catch (err) {
        setError(err.message);
        console.error('Fetch error:', err);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <AuthenticatedLayout header={<h2 className='text-xl font-semibold leading-tight text-gray-800'>Admin Dashboard</h2>}>
      <Head title='Dashboard' />
      <div className='py-12'>
        <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
          {error && <p className='rounded bg-red-100 p-4 text-center text-red-700'>Error loading data: {error}</p>}

          <>
            <QueueStats stats={stats} />
            <CounterTable data={counterData} />
            <QueueTable data={queueData} />
          </>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
