
'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { School, Printer, Loader2 } from 'lucide-react';

import { db } from '@/lib/firebase';
import type { Student } from '@/types/student';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

function PrintSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-10 w-3/4 mb-6" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-6 w-1/4" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(6)].map((_, j) => (
                <div key={j} className="space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-5 w-full" />
                </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const DataField = ({ label, value }: { label: string; value: any }) => {
    const displayValue = value === null || value === undefined || value === '' ? '-' : Array.isArray(value) ? value.join(', ') || '-' : value;
    return (
        <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="text-base text-gray-800">{displayValue}</p>
        </div>
    );
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4 mt-6">
    {children}
  </h3>
);

export default function PrintStudentPage() {
  const params = useParams();
  const studentId = params.studentId as string;
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId) return;

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
    return <PrintSkeleton />;
  }

  if (error || !student) {
    return (
       <Alert variant="destructive" className="no-print">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Terjadi Kesalahan</AlertTitle>
        <AlertDescription>{error || 'Data siswa tidak dapat ditemukan.'}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 border rounded-lg shadow-lg print:shadow-none print:border-none">
        <header className="flex justify-between items-center pb-4 border-b">
            <div className="flex items-center gap-4">
                <School className="h-12 w-12 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Profil Data Siswa</h1>
                    <p className="text-gray-600">SDS SMAS PGRI NARINGGUL</p>
                </div>
            </div>
             <Button onClick={() => window.print()} className="no-print">
                <Printer className="mr-2 h-4 w-4" />
                Cetak Halaman
            </Button>
        </header>
        
        <div className="mt-6">
            <SectionTitle>A. Data Pribadi Siswa</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                <DataField label="Nama Lengkap" value={student.namaLengkap} />
                <DataField label="Jenis Kelamin" value={student.jenisKelamin} />
                <DataField label="NISN" value={student.nisn} />
                <DataField label="NIS" value={student.nis} />
                <DataField label="NIK" value={student.nik} />
                <DataField label="No. KK" value={student.noKk} />
                <DataField label="Tempat, Tanggal Lahir" value={`${student.tempatLahir}, ${student.tanggalLahir}`} />
                <DataField label="Agama" value={student.agama} />
                <DataField label="Kewarganegaraan" value={student.kewarganegaraan} />
                <DataField label="Asal Sekolah" value={student.sekolahAsal} />
                <DataField label="Anak Ke-" value={student.anakKeberapa} />
                <DataField label="Status Anak" value={student.statusAnak} />
            </div>

            <SectionTitle>B. Keterangan Tempat Tinggal</SectionTitle>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                <DataField label="Alamat Jalan" value={student.alamatJalan} />
                <DataField label="RT/RW" value={`${student.rt}/${student.rw}`} />
                <DataField label="Dusun" value={student.namaDusun} />
                <DataField label="Kelurahan/Desa" value={student.namaKelurahanDesa} />
                <DataField label="Kecamatan" value={student.kecamatan} />
                <DataField label="Kode Pos" value={student.kodePos} />
                <DataField label="Tempat Tinggal" value={student.tempatTinggal} />
                <DataField label="Moda Transportasi" value={student.modaTransportasi} />
            </div>

            <SectionTitle>C. Data Ayah Kandung</SectionTitle>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                <DataField label="Nama Ayah" value={student.namaAyah} />
                <DataField label="Status Ayah" value={student.statusAyah} />
                <DataField label="NIK Ayah" value={student.nikAyah} />
                <DataField label="Tahun Lahir" value={student.tahunLahirAyah} />
                <DataField label="Pendidikan" value={student.pendidikanAyah} />
                <DataField label="Pekerjaan" value={student.pekerjaanAyah} />
                <DataField label="Penghasilan" value={student.penghasilanAyah} />
            </div>
            
             <SectionTitle>D. Data Ibu Kandung</SectionTitle>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                <DataField label="Nama Ibu" value={student.namaIbu} />
                <DataField label="Status Ibu" value={student.statusIbu} />
                <DataField label="NIK Ibu" value={student.nikIbu} />
                <DataField label="Tahun Lahir" value={student.tahunLahirIbu} />
                <DataField label="Pendidikan" value={student.pendidikanIbu} />
                <DataField label="Pekerjaan" value={student.pekerjaanIbu} />
                <DataField label="Penghasilan" value={student.penghasilanIbu} />
            </div>

            {student.namaWali && (
                 <>
                    <SectionTitle>E. Data Wali</SectionTitle>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                        <DataField label="Nama Wali" value={student.namaWali} />
                        <DataField label="NIK Wali" value={student.nikWali} />
                        <DataField label="Tahun Lahir" value={student.tahunLahirWali} />
                        <DataField label="Pendidikan" value={student.pendidikanWali} />
                        <DataField label="Pekerjaan" value={student.pekerjaanWali} />
                        <DataField label="Penghasilan" value={student.penghasilanWali} />
                    </div>
                 </>
            )}

            <SectionTitle>F. Kontak</SectionTitle>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                <DataField label="Nomor Telepon Rumah" value={student.nomorTeleponRumah} />
                <DataField label="Nomor HP" value={student.nomorHp} />
                <DataField label="Email" value={student.email} />
            </div>
        </div>
        
        <footer className="mt-8 pt-4 border-t text-center text-xs text-gray-500">
            <p>Dokumen ini dicetak pada: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p>Sistem Database Siswa SMAS PGRI Naringgul</p>
        </footer>
    </div>
  );
}
