
import { Inter } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Cetak Profil Siswa",
  description: "Halaman untuk mencetak data profil siswa.",
};

export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <main className="p-8 bg-white">
          {children}
        </main>
      </body>
    </html>
  );
}
