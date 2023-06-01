import Link from "next/link";
import "../styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Home | Connext4</title>
      </head>
      <body>
        <nav className="w-full border-b">
          <div className="container mx-auto p-5">
            <Link href="/">Connext4</Link>
          </div>
        </nav>
        <main id="main">
          <div className="container mx-auto p-5">{children}</div>
        </main>
      </body>
    </html>
  );
}
