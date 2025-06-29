
'use client';

import Image from 'next/image';
import type { Student } from '@/types/student';
import type { PrintSettings } from '@/types/settings';
import { cn } from '@/lib/utils';

const DataField = ({ label, value }: { label: string; value: any }) => {
    const displayValue = value === null || value === undefined || value === '' ? '-' : Array.isArray(value) && value.length > 0 ? value.join(', ') : Array.isArray(value) ? '-' : String(value);
    return (
        <tr>
            <td className="py-1 align-top w-2/5 text-gray-600">{label}</td>
            <td className="py-1 align-top w-[5%]">:</td>
            <td className="py-1 align-top w-auto font-medium text-gray-800">{displayValue}</td>
        </tr>
    );
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-sm font-bold text-gray-800 bg-gray-100 p-1.5 mt-3 mb-2 rounded-sm print:bg-gray-100">
    {children}
  </h3>
);

const DataSection = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <table className={cn("w-full border-collapse text-xs", className)}>
        <tbody>
            {children}
        </tbody>
    </table>
);

export function StudentPrintProfile({ student, settings }: { student: Student; settings: PrintSettings | null }) {
  const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const signaturePlace = settings?.signaturePlace || "Naringgul";
  const academicYear = settings?.academicYear || "2024/2025";

  let committeeIdDisplay = '';
  if (settings) {
    if (settings.committeeHeadNuptk) {
      committeeIdDisplay = `NUPTK. ${settings.committeeHeadNuptk}`;
    } else if (settings.committeeHeadNip) {
      committeeIdDisplay = `NIP. ${settings.committeeHeadNip}`;
    } else if (settings.committeeHeadNpa) {
      committeeIdDisplay = `NPA. ${settings.committeeHeadNpa}`;
    }
  }

  return (
    <div className="border p-6 print:border-none bg-white page-break-after">
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
          <p className="text-xs">Tahun Pelajaran {academicYear}</p>
      </div>
      
      <SectionTitle>A. DATA PRIBADI</SectionTitle>
      <div className="flex flex-row gap-6">
        <div className="w-4/5 flex-grow">
            <div className="flex flex-row gap-6">
                 {/* Left Column */}
                <div className="w-1/2">
                    <DataSection>
                        <DataField label="Nama Lengkap" value={student.namaLengkap} />
                        <DataField label="Jenis Kelamin" value={student.jenisKelamin} />
                        <DataField label="NIS" value={student.nis} />
                        <DataField label="NISN" value={student.nisn} />
                        <DataField label="NIK" value={student.nik} />
                        <DataField label="No. Kartu Keluarga" value={student.noKk} />
                        <DataField label="Tempat, Tanggal Lahir" value={`${student.tempatLahir || '-'}, ${student.tanggalLahir || '-'}`} />
                        <DataField label="No. Registrasi Akta Lahir" value={student.noRegistrasiAktaLahir} />
                        <DataField label="Agama" value={student.agama} />
                        <DataField label="Kewarganegaraan" value={student.kewarganegaraan} />
                        {student.kewarganegaraan === 'WNA' && <DataField label="Nama Negara" value={student.namaNegara} />}
                    </DataSection>
                </div>
                {/* Right Column */}
                <div className="w-1/2">
                     <DataSection>
                        <DataField label="Alamat Jalan" value={student.alamatJalan} />
                        <DataField label="RT / RW" value={`${student.rt || '-'} / ${student.rw || '-'}`} />
                        <DataField label="Dusun" value={student.namaDusun} />
                        <DataField label="Kelurahan / Desa" value={student.namaKelurahanDesa} />
                        <DataField label="Kecamatan" value={student.kecamatan} />
                        <DataField label="Kode Pos" value={student.kodePos} />
                        <DataField label="Tempat Tinggal" value={student.tempatTinggal} />
                        <DataField label="Moda Transportasi" value={student.modaTransportasi} />
                        <DataField label="Status Anak" value={student.statusAnak} />
                        <DataField label="Anak Ke-" value={student.anakKeberapa} />
                    </DataSection>
                </div>
            </div>
             <div className="flex flex-row gap-6 mt-2">
                 <div className="w-1/2">
                    <DataSection>
                         <DataField label="Jumlah Saudara Kandung" value={student.jumlahSaudaraKandung} />
                         <DataField label="Tinggi Badan (cm)" value={student.tinggiBadan} />
                         <DataField label="Lingkar Kepala (cm)" value={student.lingkarKepala} />
                         <DataField label="Hobi" value={student.hobi} />
                    </DataSection>
                 </div>
                 <div className="w-1/2">
                     <DataSection>
                         <DataField label="Jumlah Saudara Tiri" value={student.jumlahSaudaraTiri} />
                         <DataField label="Berat Badan (kg)" value={student.beratBadan} />
                         <DataField label="Punya KIP?" value={student.punyaKip} />
                         <DataField label="Cita-cita" value={student.citaCita} />
                     </DataSection>
                 </div>
            </div>
             <DataSection className="mt-2">
                <DataField label="Asal Sekolah (SMP/MTs)" value={student.sekolahAsal} />
                <DataField label="Berkebutuhan Khusus Siswa" value={student.berkebutuhanKhusus} />
            </DataSection>
        </div>
        <div className="w-1/5 flex-shrink-0">
          <div className="w-32 h-40 border-2 border-gray-400 flex items-center justify-center text-gray-400 text-xs text-center mx-auto">
              Pas Foto 3x4
          </div>
        </div>
      </div>


      <SectionTitle>B. DATA AYAH KANDUNG</SectionTitle>
      <DataSection>
        <DataField label="Nama Ayah" value={student.namaAyah} />
        <DataField label="Status Ayah" value={student.statusAyah} />
        <DataField label="NIK Ayah" value={student.nikAyah} />
        <DataField label="Tahun Lahir Ayah" value={student.tahunLahirAyah} />
        <DataField label="Pendidikan Terakhir Ayah" value={student.pendidikanAyah} />
        <DataField label="Pekerjaan Ayah" value={student.pekerjaanAyah} />
        <DataField label="Penghasilan Bulanan Ayah" value={student.penghasilanAyah} />
        <DataField label="Berkebutuhan Khusus Ayah" value={student.berkebutuhanKhususAyah} />
      </DataSection>

      <SectionTitle>C. DATA IBU KANDUNG</SectionTitle>
      <DataSection>
        <DataField label="Nama Ibu" value={student.namaIbu} />
        <DataField label="Status Ibu" value={student.statusIbu} />
        <DataField label="NIK Ibu" value={student.nikIbu} />
        <DataField label="Tahun Lahir Ibu" value={student.tahunLahirIbu} />
        <DataField label="Pendidikan Terakhir Ibu" value={student.pendidikanIbu} />
        <DataField label="Pekerjaan Ibu" value={student.pekerjaanIbu} />
        <DataField label="Penghasilan Bulanan Ibu" value={student.penghasilanIbu} />
        <DataField label="Berkebutuhan Khusus Ibu" value={student.berkebutuhanKhususIbu} />
      </DataSection>
      
      {(student.namaWali && student.namaWali.trim() !== '') && (
        <>
          <SectionTitle>D. DATA WALI</SectionTitle>
          <DataSection>
            <DataField label="Nama Wali" value={student.namaWali} />
            <DataField label="NIK Wali" value={student.nikWali} />
            <DataField label="Tahun Lahir Wali" value={student.tahunLahirWali} />
            <DataField label="Pendidikan Wali" value={student.pendidikanWali} />
            <DataField label="Pekerjaan Wali" value={student.pekerjaanWali} />
            <DataField label="Penghasilan Wali" value={student.penghasilanWali} />
          </DataSection>
        </>
      )}

      <SectionTitle>E. KONTAK</SectionTitle>
      <DataSection>
        <DataField label="Nomor Telepon Rumah" value={student.nomorTeleponRumah} />
        <DataField label="Nomor HP" value={student.nomorHp} />
        <DataField label="Email" value={student.email} />
      </DataSection>

      <footer className="mt-8">
          <div className="flex justify-end text-xs">
              <div className="w-1/3 text-center ml-auto">
                  <p>{signaturePlace}, {today}</p>
                  <p>{settings?.committeeHeadTitle || 'Kepala SMAS PGRI Naringgul,'}</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline uppercase">{settings?.committeeHeadName || 'H. SUTARDI, S.Pd'}</p>
                  <p>{committeeIdDisplay}</p>
              </div>
          </div>
           <div className="mt-4 pt-2 border-t text-center text-[8px] text-gray-500 no-print">
              <p>Dokumen ini dicetak dari Sistem Database Siswa SMAS PGRI Naringgul pada {today}</p>
          </div>
      </footer>
    </div>
  );
}
