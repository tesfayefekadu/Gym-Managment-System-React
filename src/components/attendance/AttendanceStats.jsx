function AttendanceStats({ attendance }) {
  const total = attendance.length;

  const present = attendance.filter(
    (record) => record.status === "Present"
  ).length;

  const absent = attendance.filter(
    (record) => record.status === "Absent"
  ).length;

  const late = attendance.filter(
    (record) => record.status === "Late"
  ).length;

  const stats = [
    {
      title: "Total Records",
      value: total,
      description: "Attendance records",
      icon: "📋",
    },
    {
      title: "Present",
      value: present,
      description: "Present members",
      icon: "✅",
    },
    {
      title: "Absent",
      value: absent,
      description: "Absent members",
      icon: "❌",
    },
    {
      title: "Late",
      value: late,
      description: "Late members",
      icon: "⏰",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white rounded-xl shadow p-5"
        >
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                {stat.title}
              </p>

              <h3 className="text-3xl font-bold text-gray-800 mt-2">
                {stat.value}
              </h3>

              <p className="text-xs text-gray-400 mt-1">
                {stat.description}
              </p>
            </div>

            <div className="text-3xl">
              {stat.icon}
            </div>

          </div>
        </div>
      ))}

    </div>
  );
}

export default AttendanceStats;