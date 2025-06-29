
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
          <p className="text-xs">Tahun Pelajaran {academicYear}</p>
      </div>
      
      <div className="flex justify-between gap-6">
        <div className="w-2/3">
          <SectionTitle>A. KETERANGAN PRIBADI SISWA</SectionTitle>
          <DataField label="Nama Lengkap" value={student.namaLengkap} />
          <DataField label="Jenis Kelamin" value={student.jenisKelamin} />
          <DataField label="NIS" value={student.nis} />
          <DataField label="NISN" value={student.nisn} />
          <DataField label="NIK" value={student.nik} />
          <DataField label="No. Kartu Keluarga" value={student.noKk} />
          <DataField label="Tempat, Tgl Lahir" value={`${student.tempatLahir || ''}, ${student.tanggalLahir || ''}`} />
          <DataField label="No. Reg Akta Lahir" value={student.noRegistrasiAktaLahir} />
          <DataField label="Agama" value={student.agama} />
          <DataField label="Kewarganegaraan" value={student.kewarganegaraan} />
          {student.kewarganegaraan === 'WNA' && <DataField label="Nama Negara" value={student.namaNegara} />}
          <DataField label="Kebutuhan Khusus" value={student.berkebutuhanKhusus} />
          <DataField label="Asal Sekolah" value={student.sekolahAsal} />

          <SectionTitle>B. KETERANGAN TEMPAT TINGGAL</SectionTitle>
          <DataField label="Alamat" value={student.alamatJalan} />
          <DataField label="RT/RW" value={`${student.rt}/${student.rw}`} />
          <DataField label="Dusun" value={student.namaDusun} />
          <DataField label="Kelurahan/Desa" value={student.namaKelurahanDesa} />
          <DataField label="Kecamatan" value={student.kecamatan} />
          <DataField label="Kode Pos" value={student.kodePos} />
          <DataField label="Tempat Tinggal" value={student.tempatTinggal} />
          <DataField label="Moda Transportasi" value={student.modaTransportasi} />

          <SectionTitle>C. KETERANGAN KELUARGA</SectionTitle>
          <DataField label="Status Anak" value={student.statusAnak} />
          <DataField label="Anak Ke-" value={student.anakKeberapa} />
          <DataField label="Jml. Saudara Kandung" value={student.jumlahSaudaraKandung} />
          <DataField label="Jml. Saudara Tiri" value={student.jumlahSaudaraTiri} />

          <SectionTitle>D. BANTUAN & LAINNYA</SectionTitle>
          <DataField label="Punya KIP?" value={student.punyaKip} />
          <DataField label="Hobi" value={student.hobi} />
          <DataField label="Cita-cita" value={student.citaCita} />
        </div>
        <div className="w-1/3">
          <div className="w-32 h-40 border-2 border-gray-400 flex items-center justify-center text-gray-400 text-xs text-center mx-auto mb-4">
              Pas Foto 3x4
          </div>

          <SectionTitle>E. DATA AYAH</SectionTitle>
          <DataField label="Nama" value={student.namaAyah} />
          <DataField label="Status" value={student.statusAyah} />
          <DataField label="NIK" value={student.nikAyah} />
          <DataField label="Tahun Lahir" value={student.tahunLahirAyah} />
          <DataField label="Pendidikan" value={student.pendidikanAyah} />
          <DataField label="Pekerjaan" value={student.pekerjaanAyah} />
          <DataField label="Penghasilan" value={student.penghasilanAyah} />
          <DataField label="Kebutuhan Khusus" value={student.berkebutuhanKhususAyah} />

          <SectionTitle>F. DATA IBU</SectionTitle>
          <DataField label="Nama" value={student.namaIbu} />
          <DataField label="Status" value={student.statusIbu} />
          <DataField label="NIK" value={student.nikIbu} />
          <DataField label="Tahun Lahir" value={student.tahunLahirIbu} />
          <DataField label="Pendidikan" value={student.pendidikanIbu} />
          <DataField label="Pekerjaan" value={student.pekerjaanIbu} />
          <DataField label="Penghasilan" value={student.penghasilanIbu} />
          <DataField label="Kebutuhan Khusus" value={student.berkebutuhanKhususIbu} />
          
          {student.namaWali && (
            <>
              <SectionTitle>G. DATA WALI</SectionTitle>
              <DataField label="Nama" value={student.namaWali} />
              <DataField label="NIK" value={student.nikWali} />
              <DataField label="Tahun Lahir" value={student.tahunLahirWali} />
              <DataField label="Pendidikan" value={student.pendidikanWali} />
              <DataField label="Pekerjaan" value={student.pekerjaanWali} />
              <DataField label="Penghasilan" value={student.penghasilanWali} />
            </>
          )}

          <SectionTitle>H. KONTAK & FISIK</SectionTitle>
          <DataField label="No. Telepon" value={student.nomorTeleponRumah} />
          <DataField label="No. HP" value={student.nomorHp} />
          <DataField label="Email" value={student.email} />
          <DataField label="Tinggi Badan (cm)" value={student.tinggiBadan} />
          <DataField label="Berat Badan (kg)" value={student.beratBadan} />
          <DataField label="Lingkar Kepala (cm)" value={student.lingkarKepala} />
        </div>
      </div>

      <footer className="mt-8">
          <div className="flex justify-end text-xs">
              <div className="w-1/3 text-center">
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
