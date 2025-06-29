
import { FirebaseGate } from '@/components/firebase-gate';

export const metadata = {
  title: "Cetak Profil Siswa",
  description: "Halaman untuk mencetak data profil siswa.",
};

export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FirebaseGate>{children}</FirebaseGate>;
}
