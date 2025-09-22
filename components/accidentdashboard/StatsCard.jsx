import React from 'react';

// This is the individual card component. It's a "presentational" component
// that just displays the data it's given. It doesn't need to change much.
const StatCard = ({ title, value, icon }) => {
  return (
    <div className="flex flex-1 flex-col p-4 bg-gray-900 rounded-lg gap-y-3">
      <div className="flex items-center gap-x-4">
        <div className="p-3 bg-gray-800 rounded-lg">
          <img src={icon} alt={`${title} icon`} className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-semibold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
};


// --- THIS IS THE MAIN FIX ---
// This is the main component that you will import into your dashboards.
// It now accepts a `counts` prop containing the dynamic data.
export default function StatsCardList({ counts }) {
  // We create a new array here that combines the static information (like titles and icons)
  // with the dynamic counts that are passed in from the parent dashboard.
  const statsData = [
    {
      title: "New",
      // Use the count from props, with a fallback of 0 if data is not ready
      value: counts?.NEW ?? 0, 
      icon: "/new_icon.svg",
    },
    {
      title: "Pending",
      value: counts?.PENDING ?? 0,
      icon: "/pendin_icon.svg",
    },
    {
      title: "Completed",
      value: counts?.DONE ?? 0, // In your DB, this is "DONE", not "Completed"
      icon: "/completed_icon.svg",
    },
  ];

  return (
    <div className="flex w-full gap-6">
      {statsData.map((stat) => (
        <StatCard 
            key={stat.title} 
            title={stat.title} 
            value={stat.value}
            icon={stat.icon}
        />
      ))}
    </div>
  );
}