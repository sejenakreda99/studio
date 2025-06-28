import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Power } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Selamat Datang!</CardTitle>
          <CardDescription className="text-center">
            Anda telah berhasil login ke Portal Data Siswa.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p>Ini adalah halaman dashboard Anda.</p>
          <Button asChild variant="destructive" className="mt-4">
            <Link href="/login">
              <Power className="mr-2 h-4 w-4" />
              Logout
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
