
//NEXT SATURDATE
// NOTE: Social Proof
// NOTE: Give option for animation
// NOTE: Add templates
// NOTE: See if UI/UX can be better

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Script from "next/script";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Waitbridge",
  description: "Build your waitlist in minutes, not weeks. No coding required—just results.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      <Script
				id="g-script1"
				strategy="lazyOnload"
				src="https://www.googletagmanager.com/gtag/js?id=G-7H0D20QJGJ"
			></Script>
			<Script id="g-script2" strategy="lazyOnload">
				{`
							window.dataLayer = window.dataLayer || [];
							function gtag(){dataLayer.push(arguments);}
							gtag('js', new Date());
							gtag('config', 'G-7H0D20QJGJ');`}
			</Script>
      
      <Script id="clarity-script" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "ufbtp5j6xw");
        `}
      </Script>
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
