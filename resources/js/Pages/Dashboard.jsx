import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import QueueStats from '@/Pages/Dashboard/QueueStats';
import QueueTable from '@/Pages/Dashboard/QueueTable'; // Import QueueTable
import { Head } from '@inertiajs/react';

// Placeholder data - replace with actual data fetching later
const placeholderStats = {
  total: 150,
  priority: 30,
  waiting: 80,
  serving: 15,
  completed: 20,
  cancelled: 5,
};

const placeholderQueueData = [
  { id: 1, queue_no: 'P001', customer_type: 'Priority', service_type: 'Deposit', status: 'Now Serving', timestamp: new Date().toISOString() },
  { id: 2, queue_no: 'R001', customer_type: 'Regular', service_type: 'Withdrawal', status: 'Waiting', timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
  { id: 3, queue_no: 'R002', customer_type: 'Regular', service_type: 'Inquiry', status: 'Now Serving', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: 4, queue_no: 'P002', customer_type: 'Priority', service_type: 'New Account', status: 'Completed', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
  { id: 5, queue_no: 'R003', customer_type: 'Regular', service_type: 'Bills Payment', status: 'Cancelled', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
  { id: 6, queue_no: 'R004', customer_type: 'Regular', service_type: 'Deposit', status: 'Waiting', timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString() },
  { id: 7, queue_no: 'P003', customer_type: 'Priority', service_type: 'Withdrawal', status: 'Waiting', timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString() },
  { id: 8, queue_no: 'R005', customer_type: 'Regular', service_type: 'Inquiry', status: 'Waiting', timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString() },
  { id: 9, queue_no: 'R006', customer_type: 'Regular', service_type: 'New Account', status: 'Waiting', timestamp: new Date(Date.now() - 1000 * 60 * 6).toISOString() },
  { id: 10, queue_no: 'P004', customer_type: 'Priority', service_type: 'Bills Payment', status: 'Waiting', timestamp: new Date(Date.now() - 1000 * 60 * 7).toISOString() },
  { id: 11, queue_no: 'R007', customer_type: 'Regular', service_type: 'Deposit', status: 'Waiting', timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString() },
];

export default function Dashboard() {
  const stats = placeholderStats;
  const queueData = placeholderQueueData;

  return (
    <AuthenticatedLayout header={<h2 className='text-xl font-semibold leading-tight text-gray-800'>Admin Dashboard</h2>}>
      <Head title='Dashboard' />
      <div className='py-12'>
        <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
          <QueueStats stats={stats} />
          <QueueTable data={queueData} />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
