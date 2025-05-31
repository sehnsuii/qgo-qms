const defaultStats = {
  total: 0,
  priority: 0,
  nonPriority: 0,
  waiting: 0,
  serving: 0,
  completed: 0,
  cancelled: 0,
};

export default function QueueStats({ stats = defaultStats }) {
  return (
    <div className='mb-6 rounded-xl bg-white p-6 shadow-lg'>
      <h3 className='mb-6 text-2xl font-extrabold text-gray-800 border-b-2 border-blue-500 pb-2'>At a Glance</h3>
      <div className='grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-7'>
        <StatCard
          label='Total Queues'
          value={stats.total}
          colorClass='from-gray-400 to-gray-600'
        />
        <StatCard
          label='Priority'
          value={stats.priority}
          colorClass='from-yellow-400 to-yellow-900'
        />
        <StatCard
          label='Regular'
          value={stats.nonPriority}
          colorClass='from-green-500 to-green-900'
        />
        <StatCard
          label='Waiting'
          value={stats.waiting}
          colorClass='from-purple-500 to-purple-950'
        />
        <StatCard
          label='Now Serving'
          value={stats.serving}
          colorClass='from-cyan-300 to-cyan-950'
        />
        <StatCard
          label='Completed'
          value={stats.completed}
          colorClass='from-green-400 to-green-900'
        />
        <StatCard
          label='Cancelled'
          value={stats.cancelled}
          colorClass='from-red-400 to-red-900'
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, colorClass }) {
  return (
    <div className={`rounded-lg p-5 text-center text-white shadow-md transform transition duration-300 hover:scale-105 bg-gradient-to-br ${colorClass}`}>
      <div className='text-6xl font-bold mb-1'>{value}</div>
      <div className='text-sm opacity-90'>{label}</div>
    </div>
  );
}
