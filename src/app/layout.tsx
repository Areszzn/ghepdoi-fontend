import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: {
    default: "Ghép đôi thần tốc - Ứng dụng hẹn hò số 1 Việt Nam",
    template: "%s | Ghép đôi thần tốc"
  },
  description: "Ghép đôi thần tốc - Ứng dụng hẹn hò, kết bạn và tìm kiếm tình yêu đích thực. Kết nối với hàng triệu người dùng, tìm kiếm người phù hợp với bạn một cách nhanh chóng và an toàn.",
  keywords: [
    "ghép đôi",
    "hẹn hò",
    "tìm kiếm tình yêu",
    "kết bạn",
    "ứng dụng hẹn hò",
    "dating app",
    "tình yêu",
    "người yêu",
    "hôn nhân",
    "kết nối",
    "Việt Nam"
  ],
  authors: [{ name: "Ghép đôi thần tốc Team" }],
  creator: "Ghép đôi thần tốc",
  publisher: "Ghép đôi thần tốc",
  metadataBase: new URL("https://ghepdoi.live"),
  openGraph: {
    title: "Ghép đôi thần tốc - Ứng dụng hẹn hò số 1 Việt Nam",
    description: "Ghép đôi thần tốc - Ứng dụng hẹn hò, kết bạn và tìm kiếm tình yêu đích thực. Kết nối với hàng triệu người dùng, tìm kiếm người phù hợp với bạn một cách nhanh chóng và an toàn.",
    url: "https://ghepdoi.live",
    siteName: "Ghép đôi thần tốc",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ghép đôi thần tốc - Ứng dụng hẹn hò số 1 Việt Nam",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ghép đôi thần tốc - Ứng dụng hẹn hò số 1 Việt Nam",
    description: "Ghép đôi thần tốc - Ứng dụng hẹn hò, kết bạn và tìm kiếm tình yêu đích thực. Kết nối với hàng triệu người dùng, tìm kiếm người phù hợp với bạn một cách nhanh chóng và an toàn.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#FF6B9D" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
