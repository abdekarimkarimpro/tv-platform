'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "", password: "", role: "CUSTOMER", firstName: "", lastName: "", phone: "", city: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      router.push("/login?message=Registration successful! Please log in.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold">Create an Account</h2>
        {error && <p className="mb-4 text-center text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required className="w-full rounded border p-2" />
          <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required className="w-full rounded border p-2" />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full rounded border p-2" />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full rounded border p-2" />
          <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} required className="w-full rounded border p-2" />
          <input type="text" name="city" placeholder="City" onChange={handleChange} required className="w-full rounded border p-2" />
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Register as</label>
            <select name="role" id="role" onChange={handleChange} value={formData.role} className="mt-1 w-full rounded border p-2">
              <option value="CUSTOMER">Customer</option>
              <option value="TECHNICIAN">Technician</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
