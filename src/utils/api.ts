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

const PRODUCTION = process.env.NEXT_PUBLIC_PRODUCTION === "true";
const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL;
const LOCAL_URL = process.env.NEXT_PUBLIC_LOCAL_URL;

const getBaseUrl = (): string => {
  const url = PRODUCTION ? WEBSITE_URL : LOCAL_URL;
  if (!url) {
    throw new Error(
      PRODUCTION
        ? "NEXT_PUBLIC_WEBSITE_URL is not defined in .env"
        : "NEXT_PUBLIC_LOCAL_URL is not defined in .env",
    );
  }
  return url.replace(/\/$/, ""); // strip trailing slash
};

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${getBaseUrl()}/api/users`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export type { User };
