
"use client";

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, UserPlus, FileDown } from 'lucide-react';
import * as XLSX from 'xlsx';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Student } from '@/types/student';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

interface StudentListProps {
  students: Student[];
  onUpdateStatus: (studentId: string, status: string, catatan?: string) => Promise<void>;
  onDeleteStudent: (studentId: string) => Promise<void>;
}

export function StudentList({ students, onUpdateStatus, onDeleteStudent }: StudentListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [residuDialog, setResiduDialog] = useState<{ open: boolean; studentId: string | null }>({ open: false, studentId: null });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; studentId: string | null, studentName: string | null }>({ open: false, studentId: null, studentName: null });
  const [catatan, setCatatan] = useState('');

  const handleOpenResiduDialog = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    setResiduDialog({ open: true, studentId });
    setCatatan(student?.catatanValidasi || '');
  };
  
  const handleSubmitResidu = async () => {
    if (residuDialog.studentId) {
      await onUpdateStatus(residuDialog.studentId, 'Residu', catatan);
      setResiduDialog({ open: false, studentId: null });
    }
  };

  const handleOpenDeleteDialog = (studentId: string, studentName: string) => {
    setDeleteDialog({ open: true, studentId, studentName });
  };

  const handleSubmitDelete = async () => {
    if (deleteDialog.studentId) {
      await onDeleteStudent(deleteDialog.studentId);
      setDeleteDialog({ open: false, studentId: null, studentName: null });
    }
  };

  const handleExportToExcel = () => {
    if (students.length === 0) {
      toast({
        variant: "destructive",
        title: "Tidak Ada Data",
        description: "Tidak ada data siswa untuk diunduh.",
      });
      return;
    }

    const columns = [
      { category: 'Data Pribadi', header: 'Tanggal Registrasi', key: 'tanggalRegistrasi' },
      { category: 'Data Pribadi', header: 'Status Validasi', key: 'statusValidasi' },
      { category: 'Data Pribadi', header: 'Catatan Validasi', key: 'catatanValidasi' },
      { category: 'Data Pribadi', header: 'Nama Lengkap', key: 'namaLengkap' },
      { category: 'Data Pribadi', header: 'Jenis Kelamin', key: 'jenisKelamin' },
      { category: 'Data Pribadi', header: 'NISN', key: 'nisn' },
      { category: 'Data Pribadi', header: 'NIS', key: 'nis' },
      { category: 'Data Pribadi', header: 'Status Yatim/Piatu', key: 'statusAnak' },
      { category: 'Data Pribadi', header: 'NIK', key: 'nik' },
      { category: 'Data Pribadi', header: 'No. Kartu Keluarga', key: 'noKk' },
      { category: 'Data Pribadi', header: 'No. Registrasi Akta Lahir', key: 'noRegistrasiAktaLahir' },
      { category: 'Data Pribadi', header: 'Tempat Lahir', key: 'tempatLahir' },
      { category: 'Data Pribadi', header: 'Tanggal Lahir', key: 'tanggalLahir' },
      { category: 'Data Pribadi', header: 'Agama & Kepercayaan', key: 'agama' },
      { category: 'Data Pribadi', header: 'Kewarganegaraan', key: 'kewarganegaraan' },
      { category: 'Data Pribadi', header: 'Nama Negara', key: 'namaNegara' },
      { category: 'Data Pribadi', header: 'Alamat Jalan', key: 'alamatJalan' },
      { category: 'Data Pribadi', header: 'RT', key: 'rt' },
      { category: 'Data Pribadi', header: 'RW', key: 'rw' },
      { category: 'Data Pribadi', header: 'Nama Dusun', key: 'namaDusun' },
      { category: 'Data Pribadi', header: 'Nama Kelurahan/Desa', key: 'namaKelurahanDesa' },
      { category: 'Data Pribadi', header: 'Kecamatan', key: 'kecamatan' },
      { category: 'Data Pribadi', header: 'Kode Pos', key: 'kodePos' },
      { category: 'Data Pribadi', header: 'Tempat Tinggal', key: 'tempatTinggal' },
      { category: 'Data Pribadi', header: 'Moda Transportasi', key: 'modaTransportasi' },
      { category: 'Data Pribadi', header: 'Anak Ke-berapa', key: 'anakKeberapa' },
      { category: 'Data Pribadi', header: 'Punya KIP?', key: 'punyaKip' },
      { category: 'Data Pribadi', header: 'Asal Sekolah SMP/MTs', key: 'sekolahAsal' },
      { category: 'Data Pribadi', header: 'Tinggi Badan (cm)', key: 'tinggiBadan' },
      { category: 'Data Pribadi', header: 'Berat Badan (kg)', key: 'beratBadan' },
      { category: 'Data Pribadi', header: 'Lingkar Kepala (cm)', key: 'lingkarKepala' },
      { category: 'Data Pribadi', header: 'Jumlah Saudara Kandung', key: 'jumlahSaudaraKandung' },
      { category: 'Data Pribadi', header: 'Jumlah Saudara Tiri', key: 'jumlahSaudaraTiri' },
      { category: 'Data Pribadi', header: 'Total Saudara', key: 'totalSaudara' },
      { category: 'Data Pribadi', header: 'Hobi', key: 'hobi' },
      { category: 'Data Pribadi', header: 'Cita-cita', key: 'citaCita' },
      { category: 'Data Pribadi', header: 'Berkebutuhan Khusus Siswa', key: 'berkebutuhanKhusus' },
      { category: 'Data Ayah', header: 'Nama Ayah Kandung', key: 'namaAyah' },
      { category: 'Data Ayah', header: 'Status Ayah', key: 'statusAyah' },
      { category: 'Data Ayah', header: 'NIK Ayah', key: 'nikAyah' },
      { category: 'Data Ayah', header: 'Tahun Lahir Ayah', key: 'tahunLahirAyah' },
      { category: 'Data Ayah', header: 'Pendidikan Terakhir Ayah', key: 'pendidikanAyah' },
      { category: 'Data Ayah', header: 'Pekerjaan Ayah', key: 'pekerjaanAyah' },
      { category: 'Data Ayah', header: 'Penghasilan Bulanan Ayah', key: 'penghasilanAyah' },
      { category: 'Data Ayah', header: 'Berkebutuhan Khusus Ayah', key: 'berkebutuhanKhususAyah' },
      { category: 'Data Ibu', header: 'Nama Ibu Kandung', key: 'namaIbu' },
      { category: 'Data Ibu', header: 'Status Ibu', key: 'statusIbu' },
      { category: 'Data Ibu', header: 'NIK Ibu', key: 'nikIbu' },
      { category: 'Data Ibu', header: 'Tahun Lahir Ibu', key: 'tahunLahirIbu' },
      { category: 'Data Ibu', header: 'Pendidikan Terakhir Ibu', key: 'pendidikanIbu' },
      { category: 'Data Ibu', header: 'Pekerjaan Ibu', key: 'pekerjaanIbu' },
      { category: 'Data Ibu', header: 'Penghasilan Bulanan Ibu', key: 'penghasilanIbu' },
      { category: 'Data Ibu', header: 'Berkebutuhan Khusus Ibu', key: 'berkebutuhanKhususIbu' },
      { category: 'Data Wali', header: 'Nama Wali', key: 'namaWali' },
      { category: 'Data Wali', header: 'NIK Wali', key: 'nikWali' },
      { category: 'Data Wali', header: 'Tahun Lahir Wali', key: 'tahunLahirWali' },
      { category: 'Data Wali', header: 'Pendidikan Terakhir Wali', key: 'pendidikanWali' },
      { category: 'Data Wali', header: 'Pekerjaan Wali', key: 'pekerjaanWali' },
      { category: 'Data Wali', header: 'Penghasilan Bulanan Wali', key: 'penghasilanWali' },
      { category: 'Kontak', header: 'Nomor Telepon Rumah', key: 'nomorTeleponRumah' },
      { category: 'Kontak', header: 'Nomor HP', key: 'nomorHp' },
      { category: 'Kontak', header: 'Email', key: 'email' },
    ];

    const excelData = [];
    const mainTitleRow = ['REKAPITULASI DATA SISWA'];
    const categoryRow: (string | null)[] = [];
    const fieldHeaderRow = columns.map(c => c.header);
    const categoryMerges = [];

    let currentCategory = '';
    let mergeStartCol = -1;
    columns.forEach((col, index) => {
      if (col.category !== currentCategory) {
        if (currentCategory !== '') {
          categoryMerges.push({ s: { r: 2, c: mergeStartCol }, e: { r: 2, c: index - 1 } });
        }
        currentCategory = col.category;
        mergeStartCol = index;
        categoryRow[index] = col.category;
      } else {
        categoryRow[index] = null;
      }
    });
    categoryMerges.push({ s: { r: 2, c: mergeStartCol }, e: { r: 2, c: columns.length - 1 } });

    excelData.push(mainTitleRow);
    excelData.push([]);
    excelData.push(categoryRow);
    excelData.push(fieldHeaderRow);

    students.forEach(student => {
      const studentRow = columns.map(col => {
        let value;
        if (col.key === 'totalSaudara') {
          const kandung = parseInt(student.jumlahSaudaraKandung || '0', 10);
          const tiri = parseInt(student.jumlahSaudaraTiri || '0', 10);
          value = (isNaN(kandung) ? 0 : kandung) + (isNaN(tiri) ? 0 : tiri);
        } else {
          value = student[col.key as keyof Student];
        }

        if (Array.isArray(value)) {
          return value.join(', ');
        }
        return value ?? '';
      });
      excelData.push(studentRow);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: columns.length - 1 } },
      ...categoryMerges
    ];

    const colWidths = fieldHeaderRow.map((header, colIndex) => {
      let maxLength = header.length;
      for (let i = 4; i < excelData.length; i++) {
        const cell = excelData[i][colIndex];
        if (cell != null) {
          const cellLength = cell.toString().length;
          if (cellLength > maxLength) {
            maxLength = cellLength;
          }
        }
      }
      return { wch: maxLength + 2 };
    });
    worksheet['!cols'] = colWidths;
    
    // Add AutoFilter
    const headerRowIndex = 3; // The row with field headers (Nama Lengkap, NISN, etc.)
    const lastCol = XLSX.utils.encode_col(columns.length - 1);
    worksheet['!autofilter'] = { ref: `A${headerRowIndex + 1}:${lastCol}${excelData.length}` };


    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Siswa");
    XLSX.writeFile(workbook, "Data_Siswa.xlsx");
  };

  const unverifiedStudents = useMemo(() => students.filter(s => s.statusValidasi === 'Belum Diverifikasi' || !s.statusValidasi), [students]);
  const validStudents = useMemo(() => students.filter(s => s.statusValidasi === 'Valid'), [students]);
  const residualStudents = useMemo(() => students.filter(s => s.statusValidasi === 'Residu'), [students]);

  const renderStudentTable = (studentList: Student[], emptyStateMessage: string) => {
    if (studentList.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-lg">
          <h3 className="text-2xl font-bold tracking-tight">
            Belum ada data siswa
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {emptyStateMessage}
          </p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Lengkap</TableHead>
            <TableHead className="hidden md:table-cell">NISN</TableHead>
            <TableHead className="hidden sm:table-cell">Jenis Kelamin</TableHead>
            <TableHead>Status Validasi</TableHead>
            <TableHead>Catatan Residu</TableHead>
            <TableHead className="hidden md:table-cell">Status Anak</TableHead>
            <TableHead>
              <span className="sr-only">Aksi</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {studentList.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.namaLengkap}</TableCell>
              <TableCell className="hidden md:table-cell">{student.nisn || '-'}</TableCell>
              <TableCell className="hidden sm:table-cell">
                 <Badge variant={student.jenisKelamin === 'Laki-laki' ? 'default' : 'secondary'}>
                  {student.jenisKelamin}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={
                  student.statusValidasi === 'Valid' ? 'default' : 
                  student.statusValidasi === 'Residu' ? 'destructive' : 'secondary'
                }>
                  {student.statusValidasi}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-xs">{student.catatanValidasi || '-'}</TableCell>
              <TableCell className="hidden md:table-cell">
                {student.statusAnak && student.statusAnak !== 'Tidak' ? (
                  <Badge variant="destructive">{student.statusAnak}</Badge>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Buka menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Aksi Cepat</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onUpdateStatus(student.id, 'Valid')}>
                      Tandai Valid
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleOpenResiduDialog(student.id)}>
                      Tandai Residu
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Manajemen</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => router.push(`/dashboard/edit-student/${student.id}`)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground" onClick={() => handleOpenDeleteDialog(student.id, student.namaLengkap)}>Hapus</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };
  
  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
            <div className="flex-1">
                <CardTitle>Daftar Siswa</CardTitle>
                <CardDescription>
                  Kelola dan validasi data siswa yang terdaftar di sekolah.
                </CardDescription>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={handleExportToExcel}>
                    <FileDown className="mr-2 h-4 w-4" />
                    Unduh Excel
                </Button>
                <Button asChild>
                    <Link href="/dashboard/add-student">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Tambah Siswa
                    </Link>
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Semua ({students.length})</TabsTrigger>
            <TabsTrigger value="unverified">Belum Diverifikasi ({unverifiedStudents.length})</TabsTrigger>
            <TabsTrigger value="valid">Valid ({validStudents.length})</TabsTrigger>
            <TabsTrigger value="residual">Residu ({residualStudents.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="pt-4">
            {renderStudentTable(students, 'Klik tombol "Tambah Siswa" untuk memulai.')}
          </TabsContent>
          <TabsContent value="unverified" className="pt-4">
            {renderStudentTable(unverifiedStudents, 'Tidak ada siswa yang perlu diverifikasi saat ini.')}
          </TabsContent>
          <TabsContent value="valid" className="pt-4">
            {renderStudentTable(validStudents, 'Belum ada siswa yang ditandai sebagai valid.')}
          </TabsContent>
          <TabsContent value="residual" className="pt-4">
            {renderStudentTable(residualStudents, 'Tidak ada siswa yang ditandai sebagai residu.')}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
    <AlertDialog open={residuDialog.open} onOpenChange={(open) => setResiduDialog({ ...residuDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tandai Siswa sebagai Residu</AlertDialogTitle>
            <AlertDialogDescription>
              Berikan alasan atau catatan mengapa data siswa ini ditandai sebagai residu. Catatan ini akan membantu untuk perbaikan data di kemudian hari.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="catatan-validasi">Catatan Validasi</Label>
              <Textarea
                id="catatan-validasi"
                placeholder="Contoh: Nama ibu kandung di KK berbeda dengan di Akta Kelahiran."
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setResiduDialog({ open: false, studentId: null })}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitResidu}>Simpan Catatan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>

    <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda Yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data siswa bernama <strong>{deleteDialog.studentName}</strong> secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialog({ open: false, studentId: null, studentName: null })}>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSubmitDelete}
              className={buttonVariants({ variant: "destructive" })}
            >
              Hapus Permanen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
