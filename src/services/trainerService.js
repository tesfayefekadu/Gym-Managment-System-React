// Initial Trainer Data

const initialTrainers = [
  {
    id: 1,
    name: "Abel Bekele",
    gender: "Male",
    phone: "0911223344",
    email: "abel@gmail.com",
    specialization: "Weight Training",
    experience: 5,
    salary: 15000,
    hireDate: "2025-01-10",
    status: "Active",
  },
  {
    id: 2,
    name: "John Mark",
    gender: "Male",
    phone: "0912334455",
    email: "john@gmail.com",
    specialization: "Cardio",
    experience: 3,
    salary: 12000,
    hireDate: "2025-03-15",
    status: "Active",
  },
  {
    id: 3,
    name: "Samuel Tesfaye",
    gender: "Male",
    phone: "0913445566",
    email: "samuel@gmail.com",
    specialization: "Yoga",
    experience: 7,
    salary: 18000,
    hireDate: "2024-08-01",
    status: "Inactive",
  },
];

export function getInitialTrainers() {
  return initialTrainers;
}