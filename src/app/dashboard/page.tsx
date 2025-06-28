
"use client";

import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

import { db, auth } from '@/lib/firebase';
import { StudentList } from '@/components/student/student-list';
import type { Student } from '@/types/student';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


async function getStudents(): Promise<Student[]> {
  try {
    const studentsCollection = collection(db, 'students');
    const q = query(studentsCollection, orderBy('tanggalRegistrasi', 'desc'));
    const querySnapshot = await getDocs(q);

    const students = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Firestore stores Timestamps, but our form expects strings for dates from Firestore
      // Let's ensure the object structure matches the Student type.
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
      };
    });

    return students as Student[];
  } catch (error) {
    console.error("Error fetching students: ", error);
    // Re-throw the error to be caught by the calling function
    throw error;
  }
}

function DashboardSkeleton() {
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

export default function DashboardPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // onAuthStateChanged is the recommended way to get the current user.
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
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
      } else {
        // If the user is not logged in, redirect to the login page.
        router.push('/login');
      }
    });

    // Cleanup subscription on unmount
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

  return <StudentList students={students} />;
}
