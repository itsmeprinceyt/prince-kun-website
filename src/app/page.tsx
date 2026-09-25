"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { fetchUsers, User } from "../utils/api";
import MadeByMe from "./(components)/MadeByMe";

const REFRESH_INTERVAL = 60_000; // 60 seconds
const TOP_N = 15;

/** Compare two user arrays by value. */
const usersEqual = (a: User[], b: User[]): boolean => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const x = a[i];
    const y = b[i];
    if (
      x.id !== y.id ||
      x.username !== y.username ||
      x.pp_cash !== y.pp_cash ||
      x.refer_tickets !== y.refer_tickets ||
      x.total_purchases !== y.total_purchases ||
      x.total_referred !== y.total_referred ||
      x.spv !== y.spv
    ) {
      return false;
    }
  }
  return true;
};

/** Sort by spv desc and keep top N. */
const normalizeUsers = (data: User[]): User[] =>
  [...data].sort((a, b) => b.spv - a.spv).slice(0, TOP_N);

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [activePage, setActivePage] = useState(1);
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const page3Ref = useRef<HTMLDivElement>(null);
  const page4Ref = useRef<HTMLDivElement>(null);

  // --- Data fetch + polling with diff-based update ---
  const loadUsers = useCallback(async () => {
    try {
      const data = await fetchUsers();
      const next = normalizeUsers(data);

      // Only trigger a re-render if the data actually changed.
      setUsers((prev) => (usersEqual(prev, next) ? prev : next));
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // initial fetch
    loadUsers();

    // poll every 60s
    const interval = setInterval(loadUsers, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [loadUsers]);

  // --- Scroll spy ---
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + window.innerHeight / 2;

    if (
      page1Ref.current &&
      page2Ref.current &&
      scrollPosition >= page1Ref.current.offsetTop &&
      scrollPosition < page2Ref.current.offsetTop
    ) {
      setActivePage(1);
    } else if (
      page2Ref.current &&
      page3Ref.current &&
      scrollPosition >= page2Ref.current.offsetTop &&
      scrollPosition < page3Ref.current.offsetTop
    ) {
      setActivePage(2);
    } else if (
      page3Ref.current &&
      page4Ref.current &&
      scrollPosition >= page3Ref.current.offsetTop &&
      scrollPosition < page4Ref.current.offsetTop
    ) {
      setActivePage(3);
    } else if (
      page4Ref.current &&
      scrollPosition >= page4Ref.current.offsetTop
    ) {
      setActivePage(4);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToPage = (page: number) => {
    const pageRefs = [page1Ref, page2Ref, page3Ref, page4Ref];
    pageRefs[page - 1].current?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      title: "Available 24/7",
      desc: "I'm always here to provide our game-services whenever you need them!",
    },
    {
      title: "Scam-Proof Service",
      desc: "Your money is completely safe with me, and I'm committed to fulfilling your orders!",
    },
    {
      title: "Money-Back Guarantee",
      desc: "Enjoy a full refund if anything goes wrong—your satisfaction is my priority!",
    },
    {
      title: "Wide Selection of Items",
      desc: "Explore a diverse range of products in my marketplace, carefully curated for you!",
    },
    {
      title: "Fast & Reliable Delivery",
      desc: "I guarantee quick and hassle-free delivery, ensuring you get your orders on time!",
    },
    {
      title: "Dedicated Customer Support",
      desc: "Need help? I'm personally here to assist you with any questions or concerns!",
    },
  ];

  return (
    <div className="bg-black">
      <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-20">
        <MadeByMe />
      </div>

      {/* Floating page nav */}
      <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-white/5 backdrop-blur-xl border border-white/10 text-purple-400 p-1.5 px-2 rounded-full shadow-2xl shadow-black/50 flex gap-1.5 z-10">
        {[1, 2, 3, 4].map((num) => (
          <button
            key={num}
            onClick={() => scrollToPage(num)}
            className={`text-xs font-medium w-7 h-7 rounded-full transition-all duration-300 cursor-pointer ${
              activePage === num
                ? "bg-linear-to-br from-purple-500 to-purple-700 text-white shadow-lg shadow-purple-600/50 scale-105"
                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Page 1 — Hero */}
      <div
        ref={page1Ref}
        className="relative h-screen bg-linear-to-b from-black via-black to-black/90 flex justify-center items-center overflow-hidden"
      >
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-175 h-175 bg-purple-700/20 blur-[140px] rounded-full" />

        <div className="relative text-white flex justify-center items-center flex-col text-center gap-4 px-6">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-purple-300/80 border border-purple-500/20 bg-purple-500/5 px-3 py-1 rounded-full">
            Trusted Game Marketplace
          </div>

          <div className="sm:text-6xl text-4xl font-extrabold bg-linear-to-r from-purple-400 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent tracking-tight">
            ItsMe Prince Shop
          </div>

          <div className="font-light text-sm sm:text-base text-white/60 sm:w-130 w-85 leading-relaxed">
            A place where you can purchase in-game items for cheap! Purchase
            items, earn referral tickets and use those tickets to get discount
            on your next purchase!
          </div>

          <Link
            href="https://discord.gg/spHgh4PGzF"
            target="_blank"
            className="mt-2 group bg-white text-black p-2.5 px-6 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-linear-to-r hover:from-purple-600 hover:to-purple-500 hover:text-white hover:shadow-xl hover:shadow-purple-600/40 hover:-translate-y-0.5"
          >
            Discord Server
            <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </div>

      {/* Page 2 — Leaderboard */}
      <div
        ref={page2Ref}
        className="h-screen bg-linear-to-t from-black via-black to-black/90 flex justify-center items-center px-3 sm:px-6"
      >
        <div className="w-full max-w-5xl">
          <div className="text-center mb-5">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Shop Leaderboard
            </h2>
            <p className="text-white/40 text-xs sm:text-sm mt-1">
              Top 15 users ranked by SPV
            </p>
          </div>

          <div className="rounded-xl overflow-hidden border border-purple-500/20 bg-black/50 backdrop-blur-md shadow-2xl shadow-purple-950/40">
            <div className="overflow-x-auto max-h-[65vh]">
              <table className="min-w-full border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-linear-to-r from-purple-800 to-purple-600 text-white">
                    {[
                      "#",
                      "User",
                      "PP Cash",
                      "Referral Tickets",
                      "Total Purchases",
                      "Total Referred",
                      "SPV",
                    ].map((heading, i) => (
                      <th
                        key={heading}
                        className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-left p-2.5 sm:p-3 whitespace-nowrap ${
                          i === 0 ? "w-10 text-center" : ""
                        }`}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading &&
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr
                        key={`skeleton-${i}`}
                        className="border-b border-white/5"
                      >
                        {Array.from({ length: 7 }).map((__, j) => (
                          <td key={j} className="p-3">
                            <div className="h-3 rounded bg-white/5 animate-pulse" />
                          </td>
                        ))}
                      </tr>
                    ))}

                  {!loading && users.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center text-white/40 text-sm py-8"
                      >
                        No users to display right now.
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    users.map((user, index) => (
                      <tr
                        key={user.id}
                        className="border-b border-white/5 text-white/90 transition-colors hover:bg-purple-500/10"
                      >
                        <td className="p-2.5 sm:p-3 text-center text-[11px] sm:text-sm">
                          {index < 3 ? (
                            <span
                              className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold ${
                                index === 0
                                  ? " text-yellow-400"
                                  : index === 1
                                    ? " text-slate-200"
                                    : "s text-amber-500"
                              }`}
                            >
                              {index + 1}
                            </span>
                          ) : (
                            <span className="text-white/40">{index + 1}</span>
                          )}
                        </td>
                        <td className="p-2.5 sm:p-3 text-[11px] sm:text-sm font-medium whitespace-nowrap">
                          {user.username}
                        </td>
                        <td className="p-2.5 sm:p-3 text-[11px] sm:text-sm text-emerald-400 font-mono">
                          {user.pp_cash}
                        </td>
                        <td className="p-2.5 sm:p-3 text-[11px] sm:text-sm text-orange-400 font-mono">
                          {user.refer_tickets}
                        </td>
                        <td className="p-2.5 sm:p-3 text-[11px] sm:text-sm font-mono">
                          {user.total_purchases}
                        </td>
                        <td className="p-2.5 sm:p-3 text-[11px] sm:text-sm font-mono">
                          {user.total_referred}
                        </td>
                        <td className="p-2.5 sm:p-3 text-[11px] sm:text-sm text-yellow-400 font-mono font-semibold">
                          {user.spv}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Page 3 — Features */}
      <div
        ref={page3Ref}
        className="h-screen bg-linear-to-b from-black via-black to-black/90 flex justify-center items-center px-4"
      >
        <div className="grid sm:grid-cols-3 grid-cols-2 gap-4 sm:gap-6 max-w-5xl">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-xl border border-purple-500/20 bg-linear-to-b from-purple-600/20 to-purple-900/10 backdrop-blur-sm p-4 text-white transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/40 hover:shadow-2xl hover:shadow-purple-600/30"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-purple-400/50 to-transparent" />

              <div className="text-[10px] font-mono text-purple-300/60 mb-2">
                0{i + 1}
              </div>

              <div className="sm:text-2xl text-lg font-bold tracking-tight leading-tight mb-3">
                {feature.title}
              </div>

              <div className="sm:text-sm text-xs text-white/60 leading-relaxed">
                {feature.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Page 4 — Video */}
      <div
        ref={page4Ref}
        className="h-screen bg-linear-to-t from-black via-black to-black/90 flex flex-col justify-center items-center gap-2 px-4"
      >
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="text-center flex flex-col gap-3">
            <div className="text-white/80 text-sm sm:text-base font-light w-75 sm:w-150 pb-3 border-b border-white/10">
              You can watch the video in which I&apos;ve explained about this
              properly!
            </div>

            <div className="w-75 sm:w-150 aspect-video rounded-xl overflow-hidden border border-purple-500/20 shadow-2xl shadow-purple-950/40">
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
