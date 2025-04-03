'use client'
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/services/product-service";
import { TamboProvider, TamboTool, type TamboComponent } from "@tambo-ai/react";
import { Geist, Geist_Mono } from "next/font/google";
import { z } from "zod";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const productsTool: TamboTool = {
  name: "products",
  description: "A tool to get products from the database",
  tool: getProducts,
  toolSchema: z.function().returns(z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    discountPercentage: z.number().optional(),
    accentColor: z.string(),
    inStock: z.boolean().optional()
  })))
}

const tamboComponents: TamboComponent[] = [
  {
    name: "ProductCard",
    description: "A product card component that displays product information with customizable pricing, discounts, and styling. Perfect for demonstrating interactive UI elements!",
    component: ProductCard,
    propsDefinition: {
      name: "string",
      price: "number",
      description: "string",
      discountPercentage: "number",
      accentColor: {
        type: "enum",
        options: ["indigo", "emerald", "rose", "amber"]
      },
      inStock: "boolean"
    },
    associatedTools: [productsTool]
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <TamboProvider
          apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
          components={tamboComponents}
        >
          {children}
        </TamboProvider>
      </body>
    </html>
  );
}
