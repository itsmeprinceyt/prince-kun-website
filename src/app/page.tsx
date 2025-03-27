"use client";

import { useEffect, useState } from "react";

interface User {
  id: number;
  username: string;
  pp_cash: number;
  refer_tickets: number;
  total_purchases: number;
  registration_date: string;
  total_referred: number;
  spv: number;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        const sortedUsers = data.sort((a: User, b: User) => b.spv - a.spv);
        setUsers(sortedUsers.slice(0, 15));
      })
      .catch((err) => console.error("Failed to load users:", err));
  }, []);


  return (
    <div>

      {/* Page 1 */}
      <div className="h-screen bg-slate-800">
        Hello
        <h1>Users</h1>
      </div>

      {/* Page 2 */}
      <div className="h-screen bg-slate-700">
        <div className="h-screen bg-slate-700 flex justify-center items-center">
          <div className="bg-white p-5 rounded-xl shadow-lg">
            <h1 className="text-xl font-bold text-center mb-4">User Rankings</h1>
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">User ID</th>
                  <th className="border p-2">PP Cash</th>
                  <th className="border p-2">Refer Tickets</th>
                  <th className="border p-2">Total Purchases</th>
                  <th className="border p-2">Total Referred</th>
                  <th className="border p-2">SPV</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="border p-2">{user.username}</td>
                    <td className="border p-2">{user.pp_cash}</td>
                    <td className="border p-2">{user.refer_tickets}</td>
                    <td className="border p-2">{user.total_purchases}</td>
                    <td className="border p-2">{user.total_referred}</td>
                    <td className="border p-2 font-bold text-blue-600">{user.spv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Page 3 */}
      <div className="h-screen bg-slate-600">

      </div>
      {/* Page 4 */}
      <div className="h-screen bg-slate-500">

      </div>
    </div>
  );
}
