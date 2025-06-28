import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="flex h-full flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-2 text-center">
        <h3 className="text-2xl font-bold tracking-tight">
          Selamat Datang di Portal Data Siswa
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Anda dapat mulai dengan menambahkan data siswa baru atau mengelola data yang ada.
        </p>
        <Button asChild>
          <Link href="/dashboard/add-student">
            <UserPlus className="mr-2 h-4 w-4" />
            Tambah Siswa Baru
          </Link>
        </Button>
      </div>
    </div>
  );
}
