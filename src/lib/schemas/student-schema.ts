import * as z from 'zod';

const optionalString = z.string().optional().or(z.literal(''));

export const studentFormSchema = z.object({
  // DATA PRIBADI
  tanggalRegistrasi: z.date({ required_error: 'Tanggal registrasi harus diisi.' }),
  namaLengkap: z.string().min(1, 'Nama lengkap harus diisi.'),
  jenisKelamin: z.enum(['Laki-laki', 'Perempuan']).optional(),
  nisn: z.string().max(10, 'NISN maksimal 10 digit.').optional().or(z.literal('')),
  nis: optionalString,
  nik: z.string().length(16, 'NIK harus 16 digit.').optional().or(z.literal('')),
  noKk: optionalString,
  tempatLahir: optionalString,
  tanggalLahir: z.date().optional(),
  noRegistrasiAktaLahir: optionalString,
  agama: z.string().optional(),
  kewarganegaraan: z.enum(['WNI', 'WNA']).optional(),
  namaNegara: optionalString,
  berkebutuhanKhusus: z.array(z.string()).optional(),
  alamatJalan: optionalString,
  rt: optionalString,
  rw: optionalString,
  namaDusun: optionalString,
  namaKelurahanDesa: optionalString,
  kecamatan: optionalString,
  kodePos: optionalString,
  tempatTinggal: z.string().optional(),
  modaTransportasi: z.string().optional(),
  anakKeberapa: optionalString,
  statusAnak: z.string().optional(),
  punyaKip: z.enum(['Ya', 'Tidak']).optional(),
  sekolahAsal: optionalString,
  tinggiBadan: optionalString,
  beratBadan: optionalString,
  lingkarKepala: optionalString,
  jumlahSaudaraKandung: optionalString,
  jumlahSaudaraTiri: optionalString,
  hobi: optionalString,
  citaCita: optionalString,

  // DATA AYAH KANDUNG
  namaAyah: optionalString,
  statusAyah: z.string().optional(),
  nikAyah: z.string().length(16, 'NIK Ayah harus 16 digit.').optional().or(z.literal('')),
  tahunLahirAyah: optionalString,
  pendidikanAyah: z.string().optional(),
  pekerjaanAyah: z.string().optional(),
  penghasilanAyah: z.string().optional(),
  berkebutuhanKhususAyah: z.array(z.string()).optional(),

  // DATA IBU KANDUNG
  namaIbu: optionalString,
  statusIbu: z.string().optional(),
  nikIbu: z.string().length(16, 'NIK Ibu harus 16 digit.').optional().or(z.literal('')),
  tahunLahirIbu: optionalString,
  pendidikanIbu: z.string().optional(),
  pekerjaanIbu: z.string().optional(),
  penghasilanIbu: z.string().optional(),
  berkebutuhanKhususIbu: z.array(z.string()).optional(),
  
  // DATA WALI
  namaWali: optionalString,
  nikWali: z.string().length(16, 'NIK Wali harus 16 digit.').optional().or(z.literal('')),
  tahunLahirWali: optionalString,
  pendidikanWali: z.string().optional(),
  pekerjaanWali: z.string().optional(),
  penghasilanWali: optionalString,

  // KONTAK
  nomorTeleponRumah: optionalString,
  nomorHp: optionalString,
  email: z.string().email({ message: 'Email tidak valid.' }).optional().or(z.literal('')),
});

export type StudentFormValues = z.infer<typeof studentFormSchema>;
