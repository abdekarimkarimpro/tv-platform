'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

  const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await signIn("credentials", {
                redirect: false,
                email: formData.email,
                password: formData.password,
        });

        if (result?.error) {
                console.error("Login failed:", result.error);
        } else {
                router.push("/");
        }
        setLoading(false);
  };

  return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
              <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                      <h2 className="mb-6 text-center text-2xl font-bold">Log In</h2>h2>
                {error && <p className="mb-4 text-center text-red-500">Invalid email or password.</p>p>}
                      <form onSubmit={handleSubmit} className="space-y-4">
                                <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full rounded border p-2" />
                                <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full rounded border p-2" />
                                <button type="submit" disabled={loading} className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400">
                                  {loading ? "Logging in..." : "Log In"}
                                </button>button>
                      </form>form>
                      <p className="mt-4 text-center text-sm">
                                Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Register</Link>Link>
                      </p>p>
              </div>div>
        </div>div>
      );
}</div>
