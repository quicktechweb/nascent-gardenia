"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match!", "error");
      return;
    }

    try {
      const res = await fetch("https://nascent.virtualshopbd.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          newpartroles: "user", // auto assign role
        }),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire("Success!", "Account created successfully.", "success");
        router.push("/admin/dashboard/login");
      } else {
        Swal.fire("Error", data.message || "Registration failed", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Server error while registering user", "error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 text-black">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Create
        </h2>

        <form className="space-y-4" onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#19745B]"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#19745B]"
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#19745B]"
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#c78436] to-[#a6712e] hover:bg-[#14533e] text-white py-2 rounded-md font-semibold transition"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
}
