
"use client";

import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { AlertCircle, FileBarChart, PieChartIcon, Users, UserCheck, UserX, Users2 } from 'lucide-react';

import { db, auth } from '@/lib/firebase';
import type { Student } from '@/types/student';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StatsDashboard } from '@/components/dashboard/stats-dashboard';

// Re-usable getStudents function
async function getStudents(): Promise<Student[]> {
  try {
    const studentsCollection = collection(db, 'students');
    const q = query(studentsCollection, orderBy('tanggalRegistrasi', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return { id: doc.id, ...data } as Student;
    }) as Student[];
  } catch (error) {
    console.error("Error fetching students: ", error);
    throw error;
  }
}


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
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoading(true);
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
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
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
