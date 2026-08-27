function PlanStats({ plans }) {
  const totalPlans = plans.length;

  const activePlans = plans.filter(
    (plan) => plan.status === "Active"
  ).length;

  const averagePrice =
    totalPlans === 0
      ? 0
      : Math.round(
          plans.reduce(
            (total, plan) =>
              total + Number(plan.price),
            0
          ) / totalPlans
        );

  const planUsage = plans.reduce((acc, plan) => {
    const count = Number(plan.members) || 0;

    if (!acc[plan.name]) {
      acc[plan.name] = 0;
    }

    acc[plan.name] += count;

    return acc;
  }, {});

  const mostPopularPlan =
    totalPlans === 0
      ? "N/A"
      : Object.keys(planUsage).reduce(
          (popular, planName) =>
            planUsage[planName] >
            planUsage[popular]
              ? planName
              : popular,
          Object.keys(planUsage)[0]
        );

  const stats = [
    {
      title: "Total Plans",
      value: totalPlans,
      icon: "📋",
      iconBg: "bg-blue-500",
    },
    {
      title: "Active Plans",
      value: activePlans,
      icon: "✅",
      iconBg: "bg-green-500",
    },
    {
      title: "Average Price",
      value: `${averagePrice.toLocaleString()} ETB`,
      icon: "💰",
      iconBg: "bg-yellow-500",
    },
    {
      title: "Most Popular",
      value: mostPopularPlan,
      icon: "⭐",
      iconBg: "bg-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {stat.title}
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-2">
                {stat.value}
              </h2>
            </div>

            <div
              className={`${stat.iconBg} w-14 h-14 rounded-full flex items-center justify-center text-2xl`}
            >
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PlanStats;