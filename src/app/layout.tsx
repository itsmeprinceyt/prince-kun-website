import type { Metadata } from "next";
import { Suspense } from "react";
import Loading from "@/(components)/Loading";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prince-Kun | The Website",
  description: "ItsMe Prince Shop - A place where you can purchase in-game items for cheap! Buy items, earn referral tickets, and use them to get discounts on your next purchase.",
  icons: "/Avatar.png",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
