
"use client";

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

import { auth } from '@/lib/firebase';
import type { Student } from '@/types/student';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StatsDashboard } from '@/components/dashboard/stats-dashboard';
import { getStudents } from '@/lib/student-service';


function DashboardSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                             <Skeleton className="h-6 w-24" />
                             <Skeleton className="h-6 w-6 rounded-sm" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-10 w-16" />
                            <Skeleton className="h-4 w-40 mt-1" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-12 lg:col-span-4">
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-60" />
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Skeleton className="w-full h-[300px]" />
                    </CardContent>
                </Card>
                <Card className="col-span-12 lg:col-span-3">
                     <CardHeader>
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-60" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="w-full h-[300px]" />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default function DashboardStatsPage() {
  const [students, setStudents] = useState<Student[]>([]);
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

    const fetchStudents = async () => {
        setError(null);
        try {
          const studentData = await getStudents();
          setStudents(studentData);
        } catch (err: any) {
          console.error(err);
          setError('Gagal memuat data siswa. Ini bisa terjadi karena masalah izin akses ke database atau indeks Firestore yang belum dibuat.');
        } finally {
          setIsLoading(false);
        }
    };
    
    fetchStudents();
  }, [isAuthenticated, router]);


  if (isLoading || isAuthenticated === null) {
    return <DashboardSkeleton />;
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

  return <StatsDashboard students={students} />;
}
