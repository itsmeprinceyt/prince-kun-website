"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import MadeByMe from "@/(components)/MadeByMe";

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

  // Reload the page every 60 seconds because the
  // database is not fetched instantly so we need to refresh the page
  // once so I'm adding this so it will refresh automatically 
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.reload();
    }, 60000);

    return () => clearTimeout(timer);
  }, []);

  const [users, setUsers] = useState<User[]>([]);

  const [activePage, setActivePage] = useState(1);
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const page3Ref = useRef<HTMLDivElement>(null);
  const page4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("https://prince-kun-website-backend.onrender.com/api/users")
      .then((res) => res.json())
      .then((data) => {
        const sortedUsers = data.sort((a: User, b: User) => b.spv - a.spv);
        setUsers(sortedUsers.slice(0, 15));
      })
      .catch((err) => console.error("Failed to load users:", err));
  }, []);

  const handleScroll = () => {
    const scrollPosition = window.scrollY + window.innerHeight / 2;

    if (page1Ref.current && scrollPosition >= page1Ref.current.offsetTop && scrollPosition < page2Ref.current!.offsetTop) {
      setActivePage(1);
    } else if (page2Ref.current && scrollPosition >= page2Ref.current.offsetTop && scrollPosition < page3Ref.current!.offsetTop) {
      setActivePage(2);
    } else if (page3Ref.current && scrollPosition >= page3Ref.current.offsetTop && scrollPosition < page4Ref.current!.offsetTop) {
      setActivePage(3);
    } else if (page4Ref.current && scrollPosition >= page4Ref.current.offsetTop) {
      setActivePage(4);
    }
  };

  const scrollToPage = (page: number) => {
    const pageRefs = [page1Ref, page2Ref, page3Ref, page4Ref];
    pageRefs[page - 1].current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <div className="fixed bottom-1 left-1/2 transform -translate-x-1/2">
        <MadeByMe />
      </div>
      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-black text-purple-500 p-2 px-3 rounded-lg shadow-lg flex gap-2 z-10">
        {[1, 2, 3, 4].map((num) => (
          <button
            key={num}
            onClick={() => scrollToPage(num)}
            className={`text-sm hover:scale-110 w-[25px] h-[25px] rounded-lg transition ${activePage === num ? "bg-purple-600 text-white shadow-lg scale-110" : "bg-white/10"
              }`}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Page 1 */}
      <div ref={page1Ref} className="h-screen bg-gradient-to-b from-black to-black/90 flex justify-center items-center">
        <div className="text-white flex justify-center items-center flex-col text-center gap-2">

          <div className="sm:text-5xl text-3xl font-extrabold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
            ItsMe Prince Shop
          </div>

          <div className="font-extralight text-sm sm:w-[500px] w-[350px] animate-pulse">
            A place where you can purchase in-game items for cheap! Purchase items, earn referral tickets and use those tickets to get discount on your next purchase!!
          </div>

          <button className="bg-white text-black p-2 rounded-md px-4 text-sm hover:scale-105 transition-all ease-in-out duration-300 hover:bg-gradient-to-r from-purple-600 to-purple-500 hover:shadow-lg hover:shadow-purple-600/40 hover:text-white">
            <Link
              href="https://discord.gg/spHgh4PGzF"
              target="_blank">
              Discord Server
            </Link>
          </button>
        </div>
      </div>

      {/* Page 2 */}
      <div ref={page2Ref} className="h-screen bg-gradient-to-t from-black to-black/90 flex justify-center items-center">

        <div className="bg-gradient-to-b from-purple-500 to-purple-700 p-2 rounded-sm shadow-lg sm:w-auto w-[400px]">
          <h1 className="text-xl font-bold text-center mb-2 text-white">SHOP LEADERBOARD</h1>
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-black/80 text-white">
                <th className="sm:text-[15px] text-[8px] border border-purple-400 p-2 sm:w-[20px] w-[10px]">S.No</th>
                <th className="sm:text-[15px] text-[8px] border border-purple-400 p-2 sm:w-[200px] w-[60px]">Users</th>
                <th className="sm:text-[15px] text-[8px] border border-purple-400 p-2 sm:w-[80px] w-[40px]">PP Cash</th>
                <th className="sm:text-[15px] text-[8px] border border-purple-400 p-2 sm:w-[80px] w-[40px]">Referral Tickets</th>
                <th className="sm:text-[15px] text-[8px] border border-purple-400 p-2 sm:w-[80px] w-[40px]">Total Purchases</th>
                <th className="sm:text-[15px] text-[8px] border border-purple-400 p-2 sm:w-[80px] w-[40px]">Total Referred</th>
                <th className="sm:text-[15px] text-[8px] border border-purple-400 p-2 sm:w-[80px] w-[40px]">SPV</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, _id) => (
                <tr key={user.id} className=" bg-black/50 text-white">
                  <td className="sm:text-[15px] text-[8px] border border-purple-400 p-2 sm:w-[20px] w-[10px]">{_id + 1}</td>
                  <td className="sm:text-[15px] text-[8px] border border-purple-400 p-2 sm:w-[200px] w-[40px]">{user.username}</td>
                  <td className="sm:text-[15px] text-[8px] border border-purple-400 p-2 sm:w-[80px] w-[40px] text-green-500">{user.pp_cash}</td>
                  <td className="sm:text-[15px] text-[8px] border border-purple-400 p-2 sm:w-[80px] w-[40px] text-orange-500">{user.refer_tickets}</td>
                  <td className="sm:text-[15px] text-[8px] border border-purple-400 p-2 sm:w-[80px] w-[40px]">{user.total_purchases}</td>
                  <td className="sm:text-[15px] text-[8px] border border-purple-400 p-2 sm:w-[80px] w-[40px]">{user.total_referred}</td>
                  <td className="sm:text-[15px] text-[8px] border border-purple-400 p-2 sm:w-[80px] w-[40px] text-yellow-500">{user.spv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Page 3 */}
      <div ref={page3Ref} className="h-screen bg-gradient-to-b from-black to-black/90 flex justify-center items-center">
        <div className="grid sm:grid-cols-3 grid-cols-2  gap-5">

          <div className="sm:w-[250px] w-[150px] h-[280px] bg-gradient-to-b from-purple-500 to-purple-600 rounded-lg p-4 text-white hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all ease-in-out duration-300">
            <div className="sm:text-4xl text-2xl font-bold sm:h-[130px] h-[122px]">
              Available 24/7
            </div>
            <div className="sm:text-lg text-sm">
              I&apos;m always here to provide our game-services whenever you need them!
            </div>
          </div>

          <div className="sm:w-[250px] w-[150px] h-[280px] bg-gradient-to-b from-purple-500 to-purple-600 rounded-lg p-4 text-white hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all ease-in-out duration-300">
          <div className="sm:text-4xl text-2xl font-bold sm:h-[130px] h-[122px]">
              Scam-Proof Service
            </div>
            <div className="sm:text-lg text-sm">
              Your money is completely safe with me, and I&apos;m committed to fulfilling your orders!
            </div>
          </div>

          <div className="sm:w-[250px] w-[150px] h-[280px] bg-gradient-to-b from-purple-500 to-purple-600 rounded-lg p-4 text-white hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all ease-in-out duration-300">
          <div className="sm:text-4xl text-2xl font-bold sm:h-[130px] h-[122px]">
              Money-Back Guarantee
            </div>
            <div className="sm:text-lg text-sm">
              Enjoy a full refund if anything goes wrong—your satisfaction is my priority!
            </div>
          </div>

          <div className="sm:w-[250px] w-[150px] h-[280px] bg-gradient-to-b from-purple-500 to-purple-600 rounded-lg p-4 text-white hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all ease-in-out duration-300">
          <div className="sm:text-4xl text-2xl font-bold sm:h-[130px] h-[122px]">
              Wide Selection of Items
            </div>
            <div className="sm:text-lg text-sm">
              Explore a diverse range of products in my marketplace, carefully curated for you!
            </div>
          </div>

          <div className="sm:w-[250px] w-[150px] h-[280px] bg-gradient-to-b from-purple-500 to-purple-600 rounded-lg p-4 text-white hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all ease-in-out duration-300">
          <div className="sm:text-4xl text-2xl font-bold sm:h-[130px] h-[122px]">
              Fast & Reliable Delivery
            </div>
            <div className="sm:text-lg text-sm">
              I guarantee quick and hassle-free delivery, ensuring you get your orders on time!
            </div>
          </div>

          <div className="sm:w-[250px] w-[150px] h-[280px] bg-gradient-to-b from-purple-500 to-purple-600 rounded-lg p-4 text-white hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all ease-in-out duration-300">
          <div className="sm:text-4xl text-2xl font-bold sm:h-[130px] h-[122px]">
              Dedicated Customer Support
            </div>
            <div className="sm:text-lg text-sm">
              Need help? I&apos;m personally here to assist you with any questions or concerns!
            </div>
          </div>

        </div>

      </div >

      {/* Page 4 */}
      <div ref={page4Ref} className="h-screen bg-gradient-to-t from-black to-black/90 flex flex-col justify-center items-center gap-2">
        <div className="flex flex-col justify-center items-center gap-3">
          <div className="text-center flex flex-col gap-2">
            <div className="p-3 text-xl text-white font-extralight w-[300px] sm:w-[600px] border-b border-white/30">
              You can watch the video in which I&apos;ve explained about this properly!
            </div>
            {/* Responsive YouTube Video */}
            <div className="w-[300px] sm:w-[600px] aspect-video">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/fLheG3qV3xU?si=fZBh08AW8qimvEJ3"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
