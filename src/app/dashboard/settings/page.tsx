
'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2 } from 'lucide-react';

import { auth } from '@/lib/firebase';
import type { PrintSettings } from '@/types/settings';
import { getPrintSettings } from '@/lib/settings-service';
import { PrintSettingsForm } from '@/components/settings/print-settings-form';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
        <div className="space-y-2">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
        </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
             <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
        <div className="flex justify-end">
            <Skeleton className="h-11 w-32" />
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<PrintSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated === null) return;

    if (!isAuthenticated) {
        router.push('/login');
        return;
    }
    
    const fetchSettings = async () => {
        setError(null);
        try {
          const settingsData = await getPrintSettings();
          setSettings(settingsData);
        } catch (err: any) {
          console.error(err);
          setError('Gagal memuat pengaturan. Coba muat ulang halaman.');
        } finally {
          setIsLoading(false);
        }
    };
    
    fetchSettings();
  }, [isAuthenticated, router]);


  if (isLoading || isAuthenticated === null) {
    return <SettingsSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Terjadi Kesalahan</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return <PrintSettingsForm initialData={settings} />;
}
