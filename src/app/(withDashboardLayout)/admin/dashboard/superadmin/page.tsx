"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";

interface Permissions {
  [key: string]: boolean;
}

interface Role {
  _id: string;
  name: string;
  permissions: Permissions;
}

interface User {
  _id: string;
  displayName: string;
  phoneNumber?: string;
  email?: string;
  newpartroles?: string;
  permissions: Permissions;
}

const SuperAdminPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await fetch("https://nascent.virtualshopbd.com/api/roles");
      const data = await res.json();
      setRoles(data.roles);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch roles", "error");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("https://nascent.virtualshopbd.com/api/auth/alluser");
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoleChange = async (user: User, roleName: string) => {
    const role = roles.find((r) => r.name === roleName);
    if (!role) return;

    const newPermissions = { ...user.permissions, ...role.permissions };

    try {
      const res = await fetch(
        `https://nascent.virtualshopbd.com/api/auth/update-user/${user._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newpartroles: role.name,
            permissions: newPermissions,
          }),
        }
      );
      const data = await res.json();

      if (data.success) {
        Swal.fire("Updated", `User assigned to role "${role.name}"`, "success");
        setUsers((prev) =>
          prev.map((u) =>
            u._id === user._id
              ? { ...u, newpartroles: role.name, permissions: newPermissions }
              : u
          )
        );
      }
    } catch (err) {
      console.error("Error updating user:", err);
      Swal.fire("Error", "Failed to assign role", "error");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Super Admin – Assign Roles</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-[#c78436] to-[#a6712e] text-white uppercase text-sm tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr
                key={user._id}
                className={`border-b transition-colors duration-200 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50`}
              >
                <td className="px-6 py-3 text-gray-800 font-medium">{user.displayName}</td>
                <td className="px-6 py-3 text-gray-700">{user.phoneNumber || "-"}</td>
                <td className="px-6 py-3 text-gray-700">{user.email || "-"}</td>
                <td className="px-6 py-3">
                  <select
                    value={user.newpartroles || ""}
                    onChange={(e) => handleRoleChange(user, e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  >
                    <option value="">-- Select Role --</option>
                    {roles.map((role) => (
                      <option key={role._id} value={role.name}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminPage;
