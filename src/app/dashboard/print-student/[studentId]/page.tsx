
'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { Printer, AlertCircle } from 'lucide-react';

import { db } from '@/lib/firebase';
import type { Student } from '@/types/student';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const DataField = ({ label, value }: { label: string; value: any }) => {
    const displayValue = value === null || value === undefined || value === '' ? '-' : Array.isArray(value) ? value.join(', ') || '-' : String(value);
    return (
        <div className="grid grid-cols-12 text-sm mb-1">
            <p className="col-span-4 md:col-span-3 text-gray-600">{label}</p>
            <p className="col-span-8 md:col-span-9 font-medium text-gray-800">
                <span className="mr-2">:</span>{displayValue}
            </p>
        </div>
    );
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-base font-bold text-gray-900 bg-gray-100 p-2 mt-4 mb-2 rounded-md print:bg-gray-100">
    {children}
  </h3>
);

function PrintSkeleton() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Skeleton className="h-24 w-full mb-6" />
      <Skeleton className="h-10 w-1/2 mb-6" />
      <div className="flex justify-between gap-8">
        <div className="w-2/3 space-y-4">
            {[...Array(20)].map((_, i) => (
                <div key={i} className="flex gap-4">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            ))}
        </div>
        <div className="w-1/3">
            <Skeleton className="w-32 h-40" />
        </div>
      </div>
    </div>
  );
}

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
       <Alert variant="destructive" className="no-print max-w-4xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Terjadi Kesalahan</AlertTitle>
        <AlertDescription>{error || 'Data siswa tidak dapat ditemukan.'}</AlertDescription>
      </Alert>
    );
  }
  
  const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="max-w-4xl mx-auto bg-white text-black p-8 print:p-0">
        <header className="text-center mb-6 border-b-4 border-black pb-4">
            <h1 className="text-xl font-bold uppercase">PEMERINTAH KABUPATEN CIANJUR</h1>
            <h2 className="text-lg font-semibold uppercase">DINAS PENDIDIKAN DAN KEBUDAYAAN</h2>
            <h2 className="text-2xl font-bold uppercase">SMAS PGRI NARINGGUL</h2>
            <p className="text-xs">Jl. Naringgul No. 1, Kecamatan Naringgul, Kabupaten Cianjur, Jawa Barat 43274</p>
        </header>

        <div className="text-center mb-6">
            <h3 className="text-lg font-bold underline uppercase">PROFIL DATA POKOK SISWA</h3>
            <p className="text-sm">Tahun Ajaran 2024/2025</p>
        </div>

        <div className="flex justify-end mb-4 no-print">
            <Button onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" />
                Cetak atau Simpan PDF
            </Button>
        </div>
        
        <div className="flex flex-row-reverse justify-between gap-8">
             <div className="w-1/4 flex justify-center items-start pt-2">
                <div className="w-32 h-40 border-2 border-gray-400 flex items-center justify-center text-gray-400 text-sm text-center">
                    Pas Foto
                    <br />
                    3x4
                </div>
            </div>
            <div className="w-3/4">
                <SectionTitle>A. KETERANGAN PRIBADI SISWA</SectionTitle>
                <DataField label="Nama Lengkap" value={student.namaLengkap} />
                <DataField label="Jenis Kelamin" value={student.jenisKelamin} />
                <DataField label="NIS" value={student.nis} />
                <DataField label="NISN" value={student.nisn} />
                <DataField label="NIK" value={student.nik} />
                <DataField label="No. Kartu Keluarga" value={student.noKk} />
                <DataField label="Tempat, Tgl Lahir" value={`${student.tempatLahir}, ${student.tanggalLahir}`} />
                <DataField label="Agama" value={student.agama} />
                <DataField label="Status Anak" value={student.statusAnak} />
                <DataField label="Anak Ke-" value={student.anakKeberapa} />
                <DataField label="Asal Sekolah" value={student.sekolahAsal} />
                <DataField label="Kewarganegaraan" value={student.kewarganegaraan} />
                
                <SectionTitle>B. KETERANGAN TEMPAT TINGGAL</SectionTitle>
                <DataField label="Alamat" value={student.alamatJalan} />
                <DataField label="RT/RW" value={`${student.rt}/${student.rw}`} />
                <DataField label="Dusun" value={student.namaDusun} />
                <DataField label="Kelurahan/Desa" value={student.namaKelurahanDesa} />
                <DataField label="Kecamatan" value={student.kecamatan} />
                <DataField label="Kode Pos" value={student.kodePos} />
                <DataField label="Tempat Tinggal" value={student.tempatTinggal} />
                <DataField label="Moda Transportasi" value={student.modaTransportasi} />

                <SectionTitle>C. KETERANGAN ORANG TUA</SectionTitle>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                    <div>
                        <h4 className="font-semibold text-sm mb-2 underline">Data Ayah</h4>
                        <DataField label="Nama Ayah" value={student.namaAyah} />
                        <DataField label="Status Ayah" value={student.statusAyah} />
                        <DataField label="Pendidikan" value={student.pendidikanAyah} />
                        <DataField label="Pekerjaan" value={student.pekerjaanAyah} />
                        <DataField label="Penghasilan" value={student.penghasilanAyah} />
                    </div>
                     <div>
                        <h4 className="font-semibold text-sm mb-2 underline">Data Ibu</h4>
                        <DataField label="Nama Ibu" value={student.namaIbu} />
                        <DataField label="Status Ibu" value={student.statusIbu} />
                        <DataField label="Pendidikan" value={student.pendidikanIbu} />
                        <DataField label="Pekerjaan" value={student.pekerjaanIbu} />
                        <DataField label="Penghasilan" value={student.penghasilanIbu} />
                    </div>
                </div>

                {student.namaWali && (
                    <>
                    <SectionTitle>D. KETERANGAN WALI</SectionTitle>
                    <DataField label="Nama Wali" value={student.namaWali} />
                    <DataField label="Pendidikan" value={student.pendidikanWali} />
                    <DataField label="Pekerjaan" value={student.pekerjaanWali} />
                    <DataField label="Penghasilan" value={student.penghasilanWali} />
                    </>
                )}
                 
                 <SectionTitle>E. KONTAK</SectionTitle>
                 <DataField label="No. Telepon" value={student.nomorTeleponRumah} />
                 <DataField label="No. HP" value={student.nomorHp} />
                 <DataField label="Email" value={student.email} />
            </div>
        </div>

        <footer className="mt-16">
            <div className="flex justify-end text-sm">
                <div className="w-1/2 text-center">
                    <p>Naringgul, {today}</p>
                    <p>Kepala SMAS PGRI Naringgul,</p>
                    <div className="h-20"></div>
                    <p className="font-bold underline">H. SUTARDI, S.Pd</p>
                    <p>NUPTK. 1234567890123456</p>
                </div>
            </div>
             <div className="mt-8 pt-4 border-t text-center text-xs text-gray-500 no-print">
                <p>Dokumen ini dicetak dari Sistem Database Siswa SMAS PGRI Naringgul pada {today}</p>
            </div>
        </footer>
    </div>
  );
}
