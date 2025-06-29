
"use client";

import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
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


async function getStudents(): Promise<Student[]> {
  try {
    const studentsCollection = collection(db, 'students');
    const q = query(studentsCollection, orderBy('tanggalRegistrasi', 'desc'));
    const querySnapshot = await getDocs(q);

    const students = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        namaLengkap: data.namaLengkap || '',
        jenisKelamin: data.jenisKelamin || 'Laki-laki',
        nisn: data.nisn || '',
        nis: data.nis || '',
        nik: data.nik || '',
        noKk: data.noKk || '',
        tempatLahir: data.tempatLahir || '',
        tanggalLahir: data.tanggalLahir || '',
        noRegistrasiAktaLahir: data.noRegistrasiAktaLahir || '',
        agama: data.agama || '',
        kewarganegaraan: data.kewarganegaraan || 'WNI',
        namaNegara: data.namaNegara || '',
        berkebutuhanKhusus: data.berkebutuhanKhusus || [],
        alamatJalan: data.alamatJalan || '',
        rt: data.rt || '',
        rw: data.rw || '',
        namaDusun: data.namaDusun || '',
        namaKelurahanDesa: data.namaKelurahanDesa || '',
        kecamatan: data.kecamatan || '',
        kodePos: data.kodePos || '',
        tempatTinggal: data.tempatTinggal || '',
        modaTransportasi: data.modaTransportasi || '',
        anakKeberapa: data.anakKeberapa || '',
        statusAnak: data.statusAnak || 'Tidak',
        punyaKip: data.punyaKip,
        namaAyah: data.namaAyah || '',
        statusAyah: data.statusAyah || 'Masih Hidup',
        nikAyah: data.nikAyah || '',
        tahunLahirAyah: data.tahunLahirAyah || '',
        pendidikanAyah: data.pendidikanAyah || '',
        pekerjaanAyah: data.pekerjaanAyah || '',
        penghasilanAyah: data.penghasilanAyah || '',
        berkebutuhanKhususAyah: data.berkebutuhanKhususAyah || [],
        namaIbu: data.namaIbu || '',
        statusIbu: data.statusIbu || 'Masih Hidup',
        nikIbu: data.nikIbu || '',
        tahunLahirIbu: data.tahunLahirIbu || '',
        pendidikanIbu: data.pendidikanIbu || '',
        pekerjaanIbu: data.pekerjaanIbu || '',
        penghasilanIbu: data.penghasilanIbu || '',
        berkebutuhanKhususIbu: data.berkebutuhanKhususIbu || [],
        namaWali: data.namaWali || '',
        nikWali: data.nikWali || '',
        tahunLahirWali: data.tahunLahirWali || '',
        pendidikanWali: data.pendidikanWali || '',
        pekerjaanWali: data.pekerjaanWali || '',
        penghasilanWali: data.penghasilanWali || '',
        nomorTeleponRumah: data.nomorTeleponRumah || '',
        nomorHp: data.nomorHp || '',
        email: data.email || '',
        tanggalRegistrasi: data.tanggalRegistrasi || '',
        sekolahAsal: data.sekolahAsal || '',
        tinggiBadan: data.tinggiBadan || '',
        beratBadan: data.beratBadan || '',
        lingkarKepala: data.lingkarKepala || '',
        jumlahSaudaraKandung: data.jumlahSaudaraKandung || '',
        jumlahSaudaraTiri: data.jumlahSaudaraTiri || '',
        hobi: data.hobi || '',
        citaCita: data.citaCita || '',
        statusValidasi: data.statusValidasi || 'Belum Diverifikasi',
        catatanValidasi: data.catatanValidasi || null,
      };
    });

    return students as Student[];
  } catch (error) {
    console.error("Error fetching students: ", error);
    throw error;
  }
}

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

export default function StudentListPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const fetchStudents = async () => {
    setIsLoading(true);
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchStudents();
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleUpdateStudentStatus = async (studentId: string, status: string, catatan?: string) => {
    const studentRef = doc(db, 'students', studentId);
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
    const studentRef = doc(db, 'students', studentId);
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
      description: 'Mohon tunggu, data siswa sedang ditambahkan ke sistem.',
    });

    try {
      const batch = writeBatch(db);
      newStudents.forEach(studentData => {
        const studentRef = doc(collection(db, 'students'));
        
        const processedData: { [key: string]: any } = {
          ...studentData,
          tanggalRegistrasi: format(new Date(), 'yyyy-MM-dd'),
          statusValidasi: 'Belum Diverifikasi',
          catatanValidasi: null,
        };

        for (const key in processedData) {
          if (processedData[key] === undefined) {
            processedData[key] = null;
          }
        }
        batch.set(studentRef, processedData);
      });

      await batch.commit();

      toast({
        title: "Impor Berhasil!",
        description: `${newStudents.length} data siswa baru telah berhasil diimpor.`,
      });
      fetchStudents(); // Refresh the student list
    } catch (error) {
      console.error("Error importing students: ", error);
      toast({
        variant: "destructive",
        title: "Gagal Mengimpor Data",
        description: "Terjadi kesalahan. Pastikan format file Excel Anda benar.",
      });
    } finally {
      dismiss();
    }
  };


  if (isLoading) {
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
    />
  );
}
