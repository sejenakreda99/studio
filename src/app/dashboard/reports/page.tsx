
"use client";

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

import { auth } from '@/lib/firebase';
import type { Student } from '@/types/student';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ReportsDashboard } from '@/components/reports/reports-dashboard';
import { getStudents } from '@/lib/student-service';


function ReportsSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                 <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Skeleton className="w-full h-[350px]" />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Skeleton className="w-full h-[350px]" />
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="pl-2">
                    <Skeleton className="w-full h-[300px]" />
                </CardContent>
            </Card>
        </div>
    )
}

export default function ReportsPage() {
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
          setError('Gagal memuat data siswa untuk laporan.');
        } finally {
          setIsLoading(false);
        }
    };
    
    fetchStudents();
  }, [isAuthenticated, router]);


  if (isLoading || isAuthenticated === null) {
    return <ReportsSkeleton />;
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

  return <ReportsDashboard students={students} />;
}
