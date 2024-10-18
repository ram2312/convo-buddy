"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [nickName, setNickName] = useState("");
  const [role, setRole] = useState("Parent");
  const [gender, setGender] = useState("Male");
  const [language, setLanguage] = useState("English");

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      alert("No user found. Redirecting to login.");
      router.push("/auth/login");
    } else {
      setEmail(userEmail);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          fullName,
          nickName,
          role,
          gender,
          language,
        }),
      });

      if (response.ok) {
        alert("Profile updated successfully!");
        router.push("/dashboard");
      } else {
        const data = await response.json();
        alert(data.error);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      alert("Something went wrong, please try again.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-4xl w-full">
        <div className="flex items-center space-x-4 mb-8">
          <img
            src="/avatar.png" // Replace with actual avatar image path
            alt="Avatar"
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h2 className="text-2xl font-bold">Alexa Rawles</h2>
            <p className="text-gray-500">{email}</p>
          </div>
          <button className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Edit
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
          <div>
            <label className="block mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none"
              placeholder="Your Full Name"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Nick Name</label>
            <input
              type="text"
              value={nickName}
              onChange={(e) => setNickName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none"
              placeholder="Your First Name"
            />
          </div>

          <div>
            <label className="block mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Role (Parent/Teacher)</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="Parent">Parent</option>
              <option value="Teacher">Teacher</option>
              <option value="Child">Child</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Site Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
  
            </select>
          </div>

          <button
            type="submit"
            className="col-span-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
