import { useState } from "react";

function TrainerForm({ onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    gender: "Male",
    phone: "",
    email: "",
    specialization: "Weight Training",
    experience: "",
    salary: "",
    hireDate: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <div>
        <label className="block mb-2">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      <div>
        <label className="block mb-2">Gender</label>

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option>Male</option>
          <option>Female</option>
        </select>

      </div>

      <div>
        <label className="block mb-2">Phone</label>

        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      <div>
        <label className="block mb-2">Email</label>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      <div>
        <label className="block mb-2">Specialization</label>

        <select
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option>Weight Training</option>
          <option>Cardio</option>
          <option>Yoga</option>
          <option>CrossFit</option>
          <option>Bodybuilding</option>
        </select>
      </div>

      <div>
        <label className="block mb-2">Experience</label>

        <input
          type="number"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      <div>
        <label className="block mb-2">Salary</label>

        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      <div>
        <label className="block mb-2">Hire Date</label>

        <input
          type="date"
          name="hireDate"
          value={formData.hireDate}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      <div>
        <label className="block mb-2">Status</label>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      <div className="md:col-span-2 flex justify-end mt-4">

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Save Trainer
        </button>

      </div>

    </form>
  );
}

export default TrainerForm;