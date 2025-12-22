"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("https://nascent.virtualshopbd.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success && data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        Swal.fire("Success!", "Logged in successfully", "success");
        router.push("/admin/dashboard");
      } else {
        Swal.fire("Error", data.message || "Login failed", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Server error", "error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md text-black">
        <h2 className="text-xl font-bold mb-6 text-center">Login</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            required
          />
          <button type="submit" className="w-full bg-[#19745B] text-white py-2 rounded-md font-semibold">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
