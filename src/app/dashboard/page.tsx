import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { StudentList } from '@/components/student/student-list';
import type { Student } from '@/types/student';

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
        punyaKip: data.punyaKip,
        namaAyah: data.namaAyah || '',
        nikAyah: data.nikAyah || '',
        tahunLahirAyah: data.tahunLahirAyah || '',
        pendidikanAyah: data.pendidikanAyah || '',
        pekerjaanAyah: data.pekerjaanAyah || '',
        penghasilanAyah: data.penghasilanAyah || '',
        berkebutuhanKhususAyah: data.berkebutuhanKhususAyah || [],
        namaIbu: data.namaIbu || '',
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
      };
    });

    return students as Student[];
  } catch (error) {
    console.error("Error fetching students: ", error);
    return [];
  }
}

export default async function DashboardPage() {
  const students = await getStudents();
  return <StudentList students={students} />;
}
