import * as z from 'zod';

const optionalString = z.string().optional().or(z.literal(''));

export const studentFormSchema = z.object({
  // DATA PRIBADI
  tanggalRegistrasi: z.date({ required_error: 'Tanggal registrasi harus diisi.' }),
  namaLengkap: z.string().min(1, 'Nama lengkap harus diisi.'),
  jenisKelamin: z.enum(['Laki-laki', 'Perempuan'], { required_error: 'Jenis kelamin harus dipilih.' }),
  nisn: z.string().max(10, 'NISN maksimal 10 digit.').optional().or(z.literal('')),
  nik: z.string().length(16, 'NIK harus 16 digit.').optional().or(z.literal('')),
  noKk: optionalString,
  tempatLahir: z.string().min(1, 'Tempat lahir harus diisi.'),
  tanggalLahir: z.date({ required_error: 'Tanggal lahir harus diisi.' }),
  noRegistrasiAktaLahir: optionalString,
  agama: z.string().min(1, 'Agama harus dipilih.'),
  kewarganegaraan: z.enum(['WNI', 'WNA']),
  namaNegara: optionalString,
  berkebutuhanKhusus: z.array(z.string()).optional(),
  alamatJalan: z.string().min(1, 'Alamat jalan harus diisi.'),
  rt: optionalString,
  rw: optionalString,
  namaDusun: optionalString,
  namaKelurahanDesa: z.string().min(1, 'Nama Kelurahan/Desa harus diisi.'),
  kecamatan: z.string().min(1, 'Kecamatan harus diisi.'),
  kodePos: optionalString,
  tempatTinggal: optionalString,
  modaTransportasi: optionalString,
  anakKeberapa: optionalString,
  punyaKip: z.enum(['Ya', 'Tidak']).optional(),

  // DATA AYAH KANDUNG
  namaAyah: z.string().min(1, 'Nama ayah harus diisi.'),
  nikAyah: z.string().length(16, 'NIK Ayah harus 16 digit.').optional().or(z.literal('')),
  tahunLahirAyah: optionalString,
  pendidikanAyah: optionalString,
  pekerjaanAyah: optionalString,
  penghasilanAyah: optionalString,
  berkebutuhanKhususAyah: z.array(z.string()).optional(),

  // DATA IBU KANDUNG
  namaIbu: z.string().min(1, 'Nama ibu harus diisi.'),
  nikIbu: z.string().length(16, 'NIK Ibu harus 16 digit.').optional().or(z.literal('')),
  tahunLahirIbu: optionalString,
  pendidikanIbu: optionalString,
  pekerjaanIbu: optionalString,
  penghasilanIbu: optionalString,
  berkebutuhanKhususIbu: z.array(z.string()).optional(),
  
  // DATA WALI
  namaWali: optionalString,
  nikWali: z.string().length(16, 'NIK Wali harus 16 digit.').optional().or(z.literal('')),
  tahunLahirWali: optionalString,
  pendidikanWali: optionalString,
  pekerjaanWali: optionalString,
  penghasilanWali: optionalString,

  // KONTAK
  nomorTeleponRumah: optionalString,
  nomorHp: optionalString,
  email: z.string().email({ message: 'Email tidak valid.' }).optional().or(z.literal('')),
});

export type StudentFormValues = z.infer<typeof studentFormSchema>;
