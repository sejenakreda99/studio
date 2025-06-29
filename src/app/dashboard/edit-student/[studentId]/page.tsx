
'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';

import { db } from '@/lib/firebase';
import type { Student } from '@/types/student';
import { EditStudentForm } from '@/components/student/edit-student-form';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

function EditFormSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-1/3 mb-4" />
      <div className="flex gap-1 border-b">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 pt-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}


export default function EditStudentPage() {
  const params = useParams();
  const studentId = params.studentId as string;
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId || !db) return;

    const fetchStudent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const studentDocRef = doc(db, 'students', studentId);
        const studentDoc = await getDoc(studentDocRef);

        if (studentDoc.exists()) {
          setStudent({ id: studentDoc.id, ...studentDoc.data() } as Student);
        } else {
          setError('Siswa tidak ditemukan.');
        }
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Gagal memuat data siswa.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  if (isLoading) {
    return <EditFormSkeleton />;
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

  if (!student) {
    return (
       <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Tidak Ditemukan</AlertTitle>
        <AlertDescription>Data siswa dengan ID ini tidak dapat ditemukan.</AlertDescription>
      </Alert>
    );
  }

  return <EditStudentForm student={student} />;
}
