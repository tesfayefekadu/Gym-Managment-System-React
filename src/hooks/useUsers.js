import { useCallback, useEffect, useState } from "react";
import { getUsers } from "../services/userService";

export default function useUsers() {
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const loadUsers = useCallback(async () => {
try {
setLoading(true);
setError("");
  const data = await getUsers();
  setUsers(Array.isArray(data) ? data : []);
} catch (err) {
  setError(err.message || "Failed to load users");
} finally {
  setLoading(false);
}

}, []);

useEffect(() => {
loadUsers();
}, [loadUsers]);

return {
users,
loading,
error,
reloadUsers: loadUsers,
};
}
