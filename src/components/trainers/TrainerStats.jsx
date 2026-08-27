function TrainerStats({ trainers }) {
  const totalTrainers = trainers.length;

  const activeTrainers = trainers.filter(
    (trainer) => trainer.status === "Active"
  ).length;

  const inactiveTrainers = trainers.filter(
    (trainer) => trainer.status === "Inactive"
  ).length;

  const averageExperience =
    totalTrainers === 0
      ? 0
      : (
          trainers.reduce(
            (total, trainer) =>
              total + Number(trainer.experience),
            0
          ) / totalTrainers
        ).toFixed(1);

  const stats = [
    {
      title: "Total Trainers",
      value: totalTrainers,
      color: "bg-blue-500",
      icon: "👨‍🏫",
    },
    {
      title: "Active Trainers",
      value: activeTrainers,
      color: "bg-green-500",
      icon: "✅",
    },
    {
      title: "Inactive Trainers",
      value: inactiveTrainers,
      color: "bg-red-500",
      icon: "❌",
    },
    {
      title: "Avg Experience",
      value: `${averageExperience} Years`,
      color: "bg-yellow-500",
      icon: "⭐",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">
                {item.title}
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {item.value}
              </h2>
            </div>

            <div
              className={`${item.color} w-14 h-14 rounded-full flex items-center justify-center text-2xl text-white`}
            >
              {item.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TrainerStats;