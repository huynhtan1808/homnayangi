import "@/styles/globals.css";
import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Chivo, Lato } from "next/font/google";
import { cn } from "@/lib/cn";
import { ThemeProvider } from "next-themes";
import Nav from "@/components/nav";
import Script from "next/script";

const queryClient = new QueryClient();

const chivo = Chivo({ subsets: ["latin"], variable: "--font-chivo" });
const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["300", "400"],
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id="
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '');`,
        }}
      />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div
            className="bg-orange-50 dark:bg-slate-900 font-sans"
          >
            <Nav />
            <Component {...pageProps} />
            <style jsx global>{`
              :root {
                --font-chivo: ${chivo.style.fontFamily};
                --font-lato: ${lato.style.fontFamily};
              }
            `}</style>
          </div>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}
