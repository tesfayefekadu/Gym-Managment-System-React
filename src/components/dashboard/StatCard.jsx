function StatCard({title, value, icon}) {

  return (

    <div className="
      bg-white 
      rounded-xl 
      shadow-md 
      p-6
      flex
      justify-between
      items-center
    ">

      <div>

        <p className="text-gray-500 text-sm">
          {title}
        </p>

        <h2 className="text-3xl font-bold mt-2">
          {value}
        </h2>

      </div>


      <div className="
        text-4xl
        bg-blue-100
        p-3
        rounded-full
      ">
        {icon}
      </div>


    </div>

  );
}

export default StatCard;