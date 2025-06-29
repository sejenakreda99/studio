
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import type { Student } from '@/types/student';
import { db } from './firebase';

export async function getStudents(): Promise<Student[]> {
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
