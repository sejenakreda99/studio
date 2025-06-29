
'use client';

import Image from 'next/image';
import type { Student } from '@/types/student';
import type { PrintSettings } from '@/types/settings';

const DataField = ({ label, value }: { label: string; value: any }) => {
    const displayValue = value === null || value === undefined || value === '' ? '-' : Array.isArray(value) ? value.join(', ') || '-' : String(value);
    return (
        <div className="grid grid-cols-12 text-xs mb-1">
            <p className="col-span-4 text-gray-600">{label}</p>
            <p className="col-span-8 font-medium text-gray-800">
                <span className="mr-2">:</span>{displayValue}
            </p>
        </div>
    );
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-sm font-bold text-gray-800 bg-gray-100 p-1.5 mt-3 mb-2 rounded-sm print:bg-gray-100">
    {children}
  </h3>
);

export function StudentPrintProfile({ student, settings }: { student: Student; settings: PrintSettings | null }) {
  const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const signaturePlace = settings?.signaturePlace || "Naringgul";

  return (
    <div className="border p-6 print:border-none aspect-[1/1.414] page-break-after">
      <header className="text-center mb-4 border-b-4 border-black pb-2">
          {settings?.schoolLetterheadUrl ? (
              <Image
                src={settings.schoolLetterheadUrl}
                alt="Kop Surat Sekolah"
                width={700}
                height={150}
                className="mx-auto"
                priority
              />
          ) : (
            <>
              <h1 className="text-xl font-bold uppercase">PEMERINTAH KABUPATEN CIANJUR</h1>
              <h2 className="text-lg font-semibold uppercase">DINAS PENDIDIKAN DAN KEBUDAYAAN</h2>
              <h2 className="text-2xl font-bold uppercase">SMAS PGRI NARINGGUL</h2>
              <p className="text-xs">Jl. Naringgul No. 1, Kecamatan Naringgul, Kabupaten Cianjur, Jawa Barat 43274</p>
            </>
          )}
      </header>

      <div className="text-center mb-4">
          <h3 className="text-base font-bold underline uppercase">PROFIL DATA POKOK SISWA</h3>
          <p className="text-xs">Tahun Ajaran 2024/2025</p>
      </div>
      
      <div className="flex justify-between gap-6">
          <div className="w-3/4">
              <SectionTitle>A. KETERANGAN PRIBADI SISWA</SectionTitle>
              <DataField label="Nama Lengkap" value={student.namaLengkap} />
              <DataField label="Jenis Kelamin" value={student.jenisKelamin} />
              <DataField label="NIS" value={student.nis} />
              <DataField label="NISN" value={student.nisn} />
              <DataField label="NIK" value={student.nik} />
              <DataField label="No. Kartu Keluarga" value={student.noKk} />
              <DataField label="Tempat, Tgl Lahir" value={`${student.tempatLahir || ''}, ${student.tanggalLahir || ''}`} />
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
              
              <SectionTitle>C. KONTAK</SectionTitle>
              <DataField label="No. Telepon" value={student.nomorTeleponRumah} />
              <DataField label="No. HP" value={student.nomorHp} />
              <DataField label="Email" value={student.email} />
          </div>
          <div className="w-1/4">
              <div className="w-32 h-40 border-2 border-gray-400 flex items-center justify-center text-gray-400 text-xs text-center mx-auto mt-6">
                  Pas Foto 3x4
              </div>
              <SectionTitle>D. DATA ORANG TUA</SectionTitle>
              <h4 className="font-semibold text-xs mb-1 underline">Data Ayah</h4>
              <DataField label="Nama" value={student.namaAyah} />
              <DataField label="Status" value={student.statusAyah} />
              <DataField label="Pendidikan" value={student.pendidikanAyah} />
              <DataField label="Pekerjaan" value={student.pekerjaanAyah} />
              <DataField label="Penghasilan" value={student.penghasilanAyah} />

              <h4 className="font-semibold text-xs mt-3 mb-1 underline">Data Ibu</h4>
              <DataField label="Nama" value={student.namaIbu} />
              <DataField label="Status" value={student.statusIbu} />
              <DataField label="Pendidikan" value={student.pendidikanIbu} />
              <DataField label="Pekerjaan" value={student.pekerjaanIbu} />
              <DataField label="Penghasilan" value={student.penghasilanIbu} />

               {student.namaWali && (
                  <>
                  <SectionTitle>E. DATA WALI</SectionTitle>
                  <DataField label="Nama" value={student.namaWali} />
                  <DataField label="Pendidikan" value={student.pendidikanWali} />
                  <DataField label="Pekerjaan" value={student.pekerjaanWali} />
                  <DataField label="Penghasilan" value={student.penghasilanWali} />
                  </>
              )}
          </div>
      </div>

      <footer className="mt-8">
          <div className="flex justify-end text-xs">
              <div className="w-1/3 text-center">
                  <p>{signaturePlace}, {today}</p>
                  <p>{settings?.committeeHeadTitle || 'Kepala SMAS PGRI Naringgul,'}</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline uppercase">{settings?.committeeHeadName || 'H. SUTARDI, S.Pd'}</p>
                  <p>{settings?.committeeHeadId ? `NUPTK. ${settings.committeeHeadId}` : ''}</p>
              </div>
          </div>
           <div className="mt-4 pt-2 border-t text-center text-[8px] text-gray-500 no-print">
              <p>Dokumen ini dicetak dari Sistem Database Siswa SMAS PGRI Naringgul pada {today}</p>
          </div>
      </footer>
    </div>
  );
}
