
import * as z from 'zod';

const optionalString = z.string().optional().nullable();

// Custom refinement for NIK: must be 16 digits or empty/null.
const nikSchema = z.string().refine((val) => !val || val.length === 16, {
  message: 'NIK harus 16 digit.',
}).optional().nullable();

// Custom refinement for email: must be a valid email format or empty/null.
const emailSchema = z.string().refine((val) => !val || z.string().email().safeParse(val).success, {
  message: 'Email tidak valid.',
}).optional().nullable();


export const studentFormSchema = z.object({
  // DATA PRIBADI
  tanggalRegistrasi: z.date({ required_error: 'Tanggal registrasi harus diisi.' }),
  namaLengkap: z.string().min(1, 'Nama lengkap harus diisi.'),
  jenisKelamin: z.enum(['Laki-laki', 'Perempuan']).optional().nullable(),
  nisn: z.string().max(10, 'NISN maksimal 10 digit.').optional().nullable(),
  nis: optionalString,
  nik: nikSchema,
  noKk: optionalString,
  tempatLahir: optionalString,
  tanggalLahir: z.date().optional().nullable(),
  noRegistrasiAktaLahir: optionalString,
  agama: z.string().optional().nullable(),
  kewarganegaraan: z.enum(['WNI', 'WNA']).optional().nullable(),
  namaNegara: optionalString,
  berkebutuhanKhusus: z.array(z.string()).optional().nullable(),
  alamatJalan: optionalString,
  rt: optionalString,
  rw: optionalString,
  namaDusun: optionalString,
  namaKelurahanDesa: optionalString,
  kecamatan: optionalString,
  kodePos: optionalString,
  tempatTinggal: z.string().optional().nullable(),
  modaTransportasi: z.string().optional().nullable(),
  anakKeberapa: optionalString,
  statusAnak: z.string().optional().nullable(),
  punyaKip: z.enum(['Ya', 'Tidak']).optional().nullable(),
  uangMasuk: optionalString,
  sekolahAsal: optionalString,
  tinggiBadan: optionalString,
  beratBadan: optionalString,
  lingkarKepala: optionalString,
  jumlahSaudaraKandung: optionalString,
  jumlahSaudaraTiri: optionalString,
  hobi: optionalString,
  citaCita: optionalString,
  statusValidasi: optionalString,
  catatanValidasi: optionalString,

  // DATA AYAH KANDUNG
  namaAyah: optionalString,
  statusAyah: z.string().optional().nullable(),
  nikAyah: nikSchema,
  tahunLahirAyah: optionalString,
  pendidikanAyah: z.string().optional().nullable(),
  pekerjaanAyah: z.string().optional().nullable(),
  penghasilanAyah: z.string().optional().nullable(),
  berkebutuhanKhususAyah: z.array(z.string()).optional().nullable(),

  // DATA IBU KANDUNG
  namaIbu: optionalString,
  statusIbu: z.string().optional().nullable(),
  nikIbu: nikSchema,
  tahunLahirIbu: optionalString,
  pendidikanIbu: z.string().optional().nullable(),
  pekerjaanIbu: z.string().optional().nullable(),
  penghasilanIbu: z.string().optional().nullable(),
  berkebutuhanKhususIbu: z.array(z.string()).optional().nullable(),
  
  // DATA WALI
  namaWali: optionalString,
  nikWali: nikSchema,
  tahunLahirWali: optionalString,
  pendidikanWali: z.string().optional().nullable(),
  pekerjaanWali: z.string().optional().nullable(),
  penghasilanWali: z.string().optional().nullable(),

  // KONTAK
  nomorTeleponRumah: optionalString,
  nomorHp: optionalString,
  email: emailSchema,
});

export type StudentFormValues = z.infer<typeof studentFormSchema>;
