import type { Metadata } from "next";
import "./globals.css";
import ConditionalNavbar from "./components/ConditionalNavbar";
import { CartProvider } from "./context/CartContext";

export const metadata: Metadata = {
  title: "B & H Barber Shop - East Village NYC",
  description: "Professional grooming services for the modern gentleman in East Village NYC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="antialiased">
        <CartProvider>
          <ConditionalNavbar />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
