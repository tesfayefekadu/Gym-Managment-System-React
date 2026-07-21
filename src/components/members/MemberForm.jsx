import { useState } from "react";

function MemberForm({ onSave }) {

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    plan: "Basic",
    status: "Active",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label className="block mb-2 font-medium">
          Full Name
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Phone
        </label>

        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Membership Plan
        </label>

        <select
          name="plan"
          value={formData.plan}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option>Basic</option>
          <option>Premium</option>
          <option>VIP</option>
        </select>
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Status
        </label>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option>Active</option>
          <option>Expired</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
      >
        Save Member
      </button>

    </form>
  );
}

export default MemberForm;