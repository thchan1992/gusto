"use client";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import "node_modules/react-modal-video/css/modal-video.css";
import "../styles/index.css";
import { Providers } from "./providers";
import { ReduxProvider } from "@/lib/provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html suppressHydrationWarning lang="en">
        {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
        <head />

        <body className="dark:bg-black">
          <ReduxProvider>
            <Providers>
              <Header />
              {children}
              <Footer />
              <ScrollToTop />
            </Providers>
          </ReduxProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
