const defaultStats = {
  total: 0,
  priority: 0,
  waiting: 0,
  serving: 0,
  completed: 0,
  cancelled: 0,
};

export default function QueueStats({ stats = defaultStats }) {
  return (
    <div className='mb-6 rounded-lg bg-white p-6 shadow-sm'>
      <h3 className='mb-4 text-lg font-semibold text-gray-700'>At a Glance</h3>
      <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6'>
        <StatCard
          label='Total Queues'
          value={stats.total}
        />
        <StatCard
          label='Priority'
          value={stats.priority}
        />
        <StatCard
          label='Waiting'
          value={stats.waiting}
        />
        <StatCard
          label='Now Serving'
          value={stats.serving}
        />
        <StatCard
          label='Completed'
          value={stats.completed}
        />
        <StatCard
          label='Cancelled'
          value={stats.cancelled}
        />
      </div>
    </div>
  );
}

function StatCard({ label, value,}) {
  return (
    <div className='rounded border border-gray-200 bg-gray-50 p-4 text-center'>
      <div className='text-2xl font-bold text-gray-800'>{value}</div>
      <div className='text-sm text-gray-500'>{label}</div>
    </div>
  );
}
