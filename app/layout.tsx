import React from 'react'
import Header from "@/app/components/Header/Header";
import Footer from "@/app/components/Footer/Footer";
import './globals.css'

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}