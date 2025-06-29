
'use client';

import { isFirebaseInitialized } from '@/lib/firebase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function FirebaseGate({ children }: { children: React.ReactNode }) {
  if (!isFirebaseInitialized) {
    return (
      <div className="container mx-auto flex h-screen items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
           <CardHeader>
                <CardTitle>Konfigurasi Error</CardTitle>
            </CardHeader>
            <CardContent>
                <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Konfigurasi Firebase Tidak Ditemukan</AlertTitle>
                <AlertDescription>
                    <p className="mb-2">Aplikasi tidak dapat terhubung ke Firebase karena kunci konfigurasi tidak ada atau tidak lengkap.</p>
                    <p>Pastikan Anda telah membuat file <strong>.env.local</strong> di folder utama proyek, menyalin konten dari <strong>.env.example</strong>, dan mengisinya dengan kredensial proyek Firebase Anda. Setelah itu, restart server pengembangan.</p>
                </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
