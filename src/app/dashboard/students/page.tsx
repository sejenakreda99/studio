
"use client";

import { useState, useEffect, Suspense } from 'react';
import { doc, updateDoc, deleteDoc, writeBatch, collection } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

import { db, auth } from '@/lib/firebase';
import { StudentList } from '@/components/student/student-list';
import type { Student } from '@/types/student';
import type { StudentFormValues } from '@/lib/schemas/student-schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { getStudents } from '@/lib/student-service';

function StudentListSkeleton() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-7 w-32 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-10 w-36" />
                </div>
                 <div className="pt-4">
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Skeleton className="h-12 w-full rounded-md" />
                    <Skeleton className="h-12 w-full rounded-md" />
                    <Skeleton className="h-12 w-full rounded-md" />
                    <Skeleton className="h-12 w-full rounded-md" />
                </div>
            </CardContent>
        </Card>
    )
}

function StudentListPageContent() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const fetchStudents = async () => {
    setError(null);
    try {
      const studentData = await getStudents();
      setStudents(studentData);
    } catch (err: any) {
      console.error(err);
      setError('Gagal memuat data siswa. Ini bisa terjadi karena masalah izin akses ke database atau indeks Firestore yang belum dibuat. Periksa konsol browser untuk detail error.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated === null) return;
    
    if (isAuthenticated) {
        fetchStudents();
    } else {
        router.push('/login');
    }
  }, [isAuthenticated, router]);


  const handleUpdateStudentStatus = async (studentId: string, status: string, catatan?: string) => {
    const studentRef = doc(db!, 'students', studentId);
    try {
      const updateData: { statusValidasi: string; catatanValidasi?: string | null } = { statusValidasi: status };

      if (status === 'Residu') {
        updateData.catatanValidasi = catatan || null;
      } else {
        updateData.catatanValidasi = null;
      }

      await updateDoc(studentRef, updateData);
      
      setStudents(prevStudents =>
        prevStudents.map(student =>
          student.id === studentId ? { ...student, statusValidasi: status, catatanValidasi: updateData.catatanValidasi } : student
        )
      );

      toast({
        title: "Status Berhasil Diperbarui",
        description: `Status siswa telah diubah menjadi ${status}.`,
      });
    } catch (error) {
      console.error("Error updating student status: ", error);
      toast({
        variant: "destructive",
        title: "Gagal Memperbarui Status",
        description: "Terjadi kesalahan saat memperbarui status siswa.",
      });
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    const studentRef = doc(db!, 'students', studentId);
    try {
        await deleteDoc(studentRef);
        setStudents(prevStudents => prevStudents.filter(student => student.id !== studentId));
        toast({
            title: "Data Siswa Dihapus",
            description: "Data siswa telah berhasil dihapus dari sistem.",
        });
    } catch (error) {
        console.error("Error deleting student: ", error);
        toast({
            variant: "destructive",
            title: "Gagal Menghapus Data",
            description: "Terjadi kesalahan saat menghapus data siswa.",
        });
    }
  };
  
  const handleImportStudents = async (newStudents: Partial<StudentFormValues>[]) => {
    const { dismiss } = toast({
      title: 'Mengimpor Data...',
      description: 'Mohon tunggu, data siswa sedang diperiksa dan diproses.',
    });

    try {
      // Create a map of existing NISN to student ID for quick lookups.
      const nisnToIdMap = new Map<string, string>();
      students.forEach(student => {
        if (student.nisn) {
          nisnToIdMap.set(student.nisn, student.id);
        }
      });

      const batch = writeBatch(db!);
      let updatedCount = 0;
      let createdCount = 0;

      newStudents.forEach(studentData => {
        const studentNisn = studentData.nisn;

        // Prepare the data by removing any undefined properties
        const processedData: { [key: string]: any } = {};
        Object.keys(studentData).forEach(key => {
            const typedKey = key as keyof typeof studentData;
            if (studentData[typedKey] !== undefined) {
                processedData[typedKey] = studentData[typedKey];
            }
        });

        // If the row has an NISN and it exists in our map, it's an UPDATE.
        if (studentNisn && nisnToIdMap.has(studentNisn)) {
          const studentId = nisnToIdMap.get(studentNisn)!;
          const studentRef = doc(db!, 'students', studentId);
          batch.update(studentRef, processedData);
          updatedCount++;
        } else { // Otherwise, it's a CREATE.
          const studentRef = doc(collection(db!, 'students'));
          const createData = {
            ...processedData,
            tanggalRegistrasi: format(new Date(), 'yyyy-MM-dd'),
            statusValidasi: 'Belum Diverifikasi',
            catatanValidasi: null,
          };
          batch.set(studentRef, createData);
          createdCount++;
        }
      });

      await batch.commit();

      dismiss();
      toast({
        title: "Impor Berhasil!",
        description: `${createdCount} data baru ditambahkan. ${updatedCount} data yang ada diperbarui.`,
      });
      fetchStudents(); 
    } catch (error) {
      console.error("Error importing students: ", error);
      dismiss();
      toast({
        variant: "destructive",
        title: "Gagal Mengimpor Data",
        description: "Terjadi kesalahan. Pastikan format file Excel dan isiannya (misal: NIK 16 digit) sudah benar.",
      });
    }
  };

  const handleBulkDelete = async (studentIds: string[]) => {
    const { dismiss } = toast({
      title: `Menghapus ${studentIds.length} data...`,
      description: 'Mohon tunggu, data siswa sedang dihapus dari sistem.',
    });

    try {
      const batch = writeBatch(db!);
      studentIds.forEach(id => {
        const studentRef = doc(db!, 'students', id);
        batch.delete(studentRef);
      });
      await batch.commit();

      setStudents(prev => prev.filter(s => !studentIds.includes(s.id)));
      toast({
        title: "Hapus Massal Berhasil!",
        description: `${studentIds.length} data siswa telah dihapus.`,
      });
    } catch (error) {
       console.error("Error bulk deleting students: ", error);
      toast({
        variant: "destructive",
        title: "Gagal Menghapus Data",
        description: "Terjadi kesalahan saat menghapus data siswa secara massal.",
      });
    } finally {
      dismiss();
    }
  };

  const handleBulkUpdateStatus = async (studentIds: string[], status: string) => {
     const { dismiss } = toast({
      title: `Memperbarui ${studentIds.length} data...`,
      description: `Status siswa sedang diubah menjadi ${status}.`,
    });

    try {
      const batch = writeBatch(db!);
      studentIds.forEach(id => {
        const studentRef = doc(db!, 'students', id);
        batch.update(studentRef, { statusValidasi: status, catatanValidasi: null });
      });
      await batch.commit();

      setStudents(prev => prev.map(s => studentIds.includes(s.id) ? { ...s, statusValidasi: status, catatanValidasi: null } : s));
      toast({
        title: "Pembaruan Massal Berhasil!",
        description: `${studentIds.length} data siswa telah diperbarui menjadi ${status}.`,
      });
    } catch (error) {
       console.error("Error bulk updating students: ", error);
      toast({
        variant: "destructive",
        title: "Gagal Memperbarui Data",
        description: "Terjadi kesalahan saat memperbarui status siswa secara massal.",
      });
    } finally {
      dismiss();
    }
  };


  if (isLoading || isAuthenticated === null) {
    return <StudentListSkeleton />;
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

  return (
    <StudentList 
      students={students} 
      onUpdateStatus={handleUpdateStudentStatus} 
      onDeleteStudent={handleDeleteStudent}
      onImportStudents={handleImportStudents}
      onBulkDelete={handleBulkDelete}
      onBulkUpdateStatus={handleBulkUpdateStatus}
    />
  );
}

export default function StudentListPage() {
  return (
    <Suspense fallback={<StudentListSkeleton />}>
      <StudentListPageContent />
    </Suspense>
  )
}
