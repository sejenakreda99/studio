
'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { Printer, AlertCircle, Loader2 } from 'lucide-react';

import { auth } from '@/lib/firebase';
import type { Student } from '@/types/student';
import type { PrintSettings } from '@/types/settings';
import { getPrintSettings } from '@/lib/settings-service';
import { getStudents } from '@/lib/student-service';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { StudentPrintProfile } from '@/components/student/student-print-profile';

function PrintAllSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Mempersiapkan semua data siswa...</p>
      </div>
    </div>
  );
}

export default function PrintAllStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [settings, setSettings] = useState<PrintSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (!auth) {
      setIsAuthenticated(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated === null) return; 

    if (!isAuthenticated) {
      setError('Otentikasi dibutuhkan. Silakan login terlebih dahulu.');
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [studentsData, settingsData] = await Promise.all([
          getStudents(),
          getPrintSettings()
        ]);
        
        if (studentsData.length > 0) {
          setStudents(studentsData);
        } else {
          setError('Tidak ada data siswa untuk dicetak.');
        }
        setSettings(settingsData);

      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.code === 'permission-denied' 
          ? 'Anda tidak memiliki izin untuk melihat data ini.' 
          : 'Gagal memuat data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  if (isLoading) {
    return <PrintAllSkeleton />;
  }

  if (error || students.length === 0) {
    return (
       <div className="max-w-4xl mx-auto p-8">
         <Alert variant="destructive" className="no-print">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Terjadi Kesalahan</AlertTitle>
          <AlertDescription>{error || 'Tidak ada data siswa yang dapat ditemukan.'}</AlertDescription>
        </Alert>
       </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white text-black p-8 print:p-0">
      <div className="flex justify-end mb-4 no-print">
        <Button onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Cetak Semua atau Simpan PDF
        </Button>
      </div>
      
      {students.map((student) => (
        <StudentPrintProfile key={student.id} student={student} settings={settings} />
      ))}
    </div>
  );
}
