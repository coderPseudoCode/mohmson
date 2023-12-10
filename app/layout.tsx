import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Provider from "./provider";
import { ToastContainer } from "react-toastify";

// const font = Inter({ subsets: "latin" });

export const metadata: Metadata = {
  title: "Sierra Leone Commercial Bank Authenticator",
  description: "An authenticator application for bank transactions at SLCB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider>
          {children}
          <ToastContainer hideProgressBar={true} />
        </Provider>
      </body>
    </html>
  );
}
