import type { Metadata } from "next";
import "./styles/globals.css";

export const metadata: Metadata = {
  title: "Next App",
  description: "Next App Description",
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <html lang="en">
    <body>{children}</body>
  </html>
);

export default RootLayout;
