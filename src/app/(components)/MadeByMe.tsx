import Link from "next/link";

export default function MadeByMe() {
  const links = [
    { label: "@itsmeprinceyt", href: "https://www.itsmeprince.com" },
    {
      label: "GitHub",
      href: "https://github.com/itsmeprinceyt/prince-kun-website",
    },
  ];

  return (
    <div className="flex items-center gap-2 text-[11px] sm:text-xs text-white/60 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 shadow-lg shadow-black/30">
      <span className="text-white/40">Made by</span>

      <div className="flex items-center gap-2">
        {links.map((link, i) => (
          <span key={link.href} className="flex items-center gap-2">
            {i > 0 && <span className="text-white/20">|</span>}
            <Link
              href={link.href}
              target="_blank"
              className="relative group text-purple-300 hover:text-purple-200 transition-colors duration-200"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-purple-300 transition-all duration-300 group-hover:w-full" />
            </Link>
          </span>
        ))}
      </div>
    </div>
  );
}
