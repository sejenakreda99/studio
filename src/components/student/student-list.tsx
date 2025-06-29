
"use client";

import { useMemo, useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MoreHorizontal, UserPlus, FileDown, Upload, FileUp, Search, CalendarIcon, Trash2, CheckCircle, ChevronDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import { DateRange } from "react-day-picker";
import { format, isAfter, isBefore, isEqual } from 'date-fns';

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
import { studentFormSchema, type StudentFormValues } from '@/lib/schemas/student-schema';
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
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { Checkbox } from '../ui/checkbox';


const excelColumns = [
    // Data Pribadi (33)
    { header: 'Nama Lengkap', key: 'namaLengkap' }, { header: 'Jenis Kelamin', key: 'jenisKelamin' },
    { header: 'NISN', key: 'nisn' }, { header: 'NIS', key: 'nis' },
    { header: 'NIK', key: 'nik' }, { header: 'No. Kartu Keluarga', key: 'noKk' },
    { header: 'Tempat Lahir', key: 'tempatLahir' }, { header: 'Tanggal Lahir (DD-MM-YYYY)', key: 'tanggalLahir' },
    { header: 'No. Registrasi Akta Lahir', key: 'noRegistrasiAktaLahir' }, { header: 'Agama & Kepercayaan', key: 'agama' },
    { header: 'Kewarganegaraan', key: 'kewarganegaraan' }, { header: 'Nama Negara', key: 'namaNegara' },
    { header: 'Berkebutuhan Khusus Siswa', key: 'berkebutuhanKhusus' }, { header: 'Alamat Jalan', key: 'alamatJalan' },
    { header: 'RT', key: 'rt' }, { header: 'RW', key: 'rw' },
    { header: 'Nama Dusun', key: 'namaDusun' }, { header: 'Nama Kelurahan/Desa', key: 'namaKelurahanDesa' },
    { header: 'Kecamatan', key: 'kecamatan' }, { header: 'Kode Pos', key: 'kodePos' },
    { header: 'Tempat Tinggal', key: 'tempatTinggal' }, { header: 'Moda Transportasi', key: 'modaTransportasi' },
    { header: 'Anak Ke-berapa', key: 'anakKeberapa' }, { header: 'Status Yatim/Piatu', key: 'statusAnak' },
    { header: 'Punya KIP?', key: 'punyaKip' }, { header: 'Asal Sekolah SMP/MTs', key: 'sekolahAsal' },
    { header: 'Tinggi Badan (cm)', key: 'tinggiBadan' }, { header: 'Berat Badan (kg)', key: 'beratBadan' },
    { header: 'Lingkar Kepala (cm)', key: 'lingkarKepala' }, { header: 'Jumlah Saudara Kandung', key: 'jumlahSaudaraKandung' },
    { header: 'Jumlah Saudara Tiri', key: 'jumlahSaudaraTiri' }, { header: 'Hobi', key: 'hobi' },
    { header: 'Cita-cita', key: 'citaCita' },
    // Data Ayah (8)
    { header: 'Nama Ayah Kandung', key: 'namaAyah' }, { header: 'Status Ayah', key: 'statusAyah' },
    { header: 'NIK Ayah', key: 'nikAyah' }, { header: 'Tahun Lahir Ayah', key: 'tahunLahirAyah' },
    { header: 'Pendidikan Terakhir Ayah', key: 'pendidikanAyah' }, { header: 'Pekerjaan Ayah', key: 'pekerjaanAyah' },
    { header: 'Penghasilan Bulanan Ayah', key: 'penghasilanAyah' }, { header: 'Berkebutuhan Khusus Ayah', key: 'berkebutuhanKhususAyah' },
    // Data Ibu (8)
    { header: 'Nama Ibu Kandung', key: 'namaIbu' }, { header: 'Status Ibu', key: 'statusIbu' },
    { header: 'NIK Ibu', key: 'nikIbu' }, { header: 'Tahun Lahir Ibu', key: 'tahunLahirIbu' },
    { header: 'Pendidikan Terakhir Ibu', key: 'pendidikanIbu' }, { header: 'Pekerjaan Ibu', key: 'pekerjaanIbu' },
    { header: 'Penghasilan Bulanan Ibu', key: 'penghasilanIbu' }, { header: 'Berkebutuhan Khusus Ibu', key: 'berkebutuhanKhususIbu' },
    // Data Wali (6)
    { header: 'Nama Wali', key: 'namaWali' }, { header: 'NIK Wali', key: 'nikWali' },
    { header: 'Tahun Lahir Wali', key: 'tahunLahirWali' }, { header: 'Pendidikan Terakhir Wali', key: 'pendidikanWali' },
    { header: 'Pekerjaan Wali', key: 'pekerjaanWali' }, { header: 'Penghasilan Bulanan Wali', key: 'penghasilanWali' },
    // Kontak (3)
    { header: 'Nomor Telepon Rumah', key: 'nomorTeleponRumah' }, { header: 'Nomor HP', key: 'nomorHp' },
    { header: 'Email', key: 'email' },
];

const excelHeadersToKeys = excelColumns.reduce((acc, col) => {
    acc[col.header] = col.key;
    return acc;
}, {} as Record<string, string>);

interface StudentListProps {
  students: Student[];
  onUpdateStatus: (studentId: string, status: string, catatan?: string) => Promise<void>;
  onDeleteStudent: (studentId: string) => Promise<void>;
  onImportStudents: (newStudents: Partial<StudentFormValues>[]) => Promise<void>;
  onBulkDelete: (studentIds: string[]) => Promise<void>;
  onBulkUpdateStatus: (studentIds: string[], status: string) => Promise<void>;
}

const totalFields = Object.keys(studentFormSchema.shape).length;

const calculateCompleteness = (student: Student): number => {
    let filledFields = 0;
    for (const key in student) {
        if (Object.prototype.hasOwnProperty.call(studentFormSchema.shape, key)) {
            const value = student[key as keyof Student];
            if (value !== null && value !== undefined && value !== '' && (!Array.isArray(value) || value.length > 0)) {
                filledFields++;
            }
        }
    }
    return (filledFields / totalFields) * 100;
};


export function StudentList({ 
  students, 
  onUpdateStatus, 
  onDeleteStudent, 
  onImportStudents,
  onBulkDelete,
  onBulkUpdateStatus
}: StudentListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  
  const [activeTab, setActiveTab] = useState(searchParams.get('status') || 'all');
  const [residuDialog, setResiduDialog] = useState<{ open: boolean; studentId: string | null }>({ open: false, studentId: null });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; studentId: string | null, studentName: string | null }>({ open: false, studentId: null, studentName: null });
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState(false);
  const [catatan, setCatatan] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [completenessFilter, setCompletenessFilter] = useState<string>('Semua');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);


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

  const handleSubmitBulkDelete = async () => {
    await onBulkDelete(selectedIds);
    setBulkDeleteDialog(false);
    setSelectedIds([]);
  };

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const searchMatch = searchTerm === '' ||
        student.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.nisn?.includes(searchTerm);
      
      const statusMatch = activeTab === 'all' ||
        (activeTab === 'unverified' && (student.statusValidasi === 'Belum Diverifikasi' || !student.statusValidasi)) ||
        (activeTab === 'valid' && student.statusValidasi === 'Valid') ||
        (activeTab === 'residual' && student.statusValidasi === 'Residu');
        
      const registrationDate = student.tanggalRegistrasi ? new Date(student.tanggalRegistrasi) : null;
      const dateMatch = !date || !date.from || (
          registrationDate &&
          (isEqual(registrationDate, date.from) || isAfter(registrationDate, date.from)) &&
          (!date.to || (isEqual(registrationDate, date.to) || isBefore(registrationDate, date.to)))
      );
      
      const completeness = calculateCompleteness(student);
      const completenessMatch = completenessFilter === 'Semua' ||
        (completenessFilter === 'lengkap' && completeness > 80) ||
        (completenessFilter === 'cukup' && completeness >= 50 && completeness <= 80) ||
        (completenessFilter === 'kurang' && completeness < 50);

      return searchMatch && statusMatch && dateMatch && completenessMatch;
    });
  }, [students, searchTerm, activeTab, date, completenessFilter]);
  
  useEffect(() => {
    setSelectedIds([]);
  }, [activeTab, searchTerm, date, completenessFilter]);


  const studentsByStatus = useMemo(() => ({
    all: students,
    unverified: students.filter(s => s.statusValidasi === 'Belum Diverifikasi' || !s.statusValidasi),
    valid: students.filter(s => s.statusValidasi === 'Valid'),
    residual: students.filter(s => s.statusValidasi === 'Residu'),
  }), [students]);

  const handleExportToExcel = (onlySelected = false) => {
    const studentsToExport = onlySelected
        ? students.filter(s => selectedIds.includes(s.id))
        : filteredStudents;

    if (studentsToExport.length === 0) {
      toast({
        variant: "destructive",
        title: "Tidak Ada Data",
        description: `Tidak ada data siswa ${onlySelected ? 'yang dipilih' : 'untuk diunduh sesuai filter'}.`,
      });
      return;
    }
  
    const groupHeadersConfig = [
        { title: ' ', span: 1 }, 
        { title: 'Data Pribadi', span: 33 }, { title: 'Data Ayah', span: 8 },
        { title: 'Data Ibu', span: 8 }, { title: 'Data Wali', span: 6 },
        { title: 'Kontak', span: 3 }, { title: 'Status Pendaftaran', span: 3 },
    ];
  
    const mainHeaderRow = ['REKAPITULASI DATA SISWA'];
  
    const groupHeaderRow: string[] = [];
    const merges = [];
    let currentCol = 0;
    for (const group of groupHeadersConfig) {
      groupHeaderRow.push(group.title);
      if (group.span > 1) {
        merges.push({ s: { r: 2, c: currentCol }, e: { r: 2, c: currentCol + group.span - 1 } });
        for (let i = 1; i < group.span; i++) groupHeaderRow.push('');
      }
      currentCol += group.span;
    }
    merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: currentCol - 1 } });
  
    const columnHeaderRow = [
      'No. Urut', ...excelColumns.map(c => c.header),
      'Tanggal Registrasi (DD-MM-YYYY)', 'Status Validasi', 'Catatan Validasi'
    ];
  
    const worksheetData = [ mainHeaderRow, [], groupHeaderRow, columnHeaderRow ];
    
    const dataToExport = studentsToExport.map((student, index) => {
      const row: any[] = [index + 1];
      excelColumns.forEach(col => {
        let value = student[col.key as keyof Student];
        if (Array.isArray(value)) value = value.join(', ');
        row.push(value ?? '');
      });
      row.push(student.tanggalRegistrasi, student.statusValidasi ?? '', student.catatanValidasi ?? '');
      return row;
    });
  
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.sheet_add_aoa(worksheet, dataToExport, { origin: 'A5' });
  
    worksheet['!merges'] = merges;
    const filterRange = `A4:${XLSX.utils.encode_col(columnHeaderRow.length - 1)}4`;
    worksheet['!autofilter'] = { ref: filterRange };
  
    const allDataForWidthCalc = [...worksheetData.slice(2), ...dataToExport];
    const colWidths = columnHeaderRow.map((_, i) => ({
      wch: Math.max(...allDataForWidthCalc.map(row => (row[i] ? row[i].toString().length : 0))) + 2,
    }));
    worksheet['!cols'] = colWidths;
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Siswa');
    XLSX.writeFile(workbook, 'Data_Siswa.xlsx');
  };

  const handleDownloadTemplate = () => {
    const headers = excelColumns.map(c => c.header.replace(' (DD-MM-YYYY)', ' (YYYY-MM-DD)'));
    const worksheet = XLSX.utils.aoa_to_sheet([headers]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "Template_Import_Siswa.xlsx");
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array', cellDates: true });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet) as Record<string, any>[];

            const newStudents: Partial<StudentFormValues>[] = json.map(row => {
                const student: Partial<StudentFormValues> = {};
                for (const header in row) {
                     const cleanHeader = header.replace(' (YYYY-MM-DD)', '');
                    if (excelHeadersToKeys[cleanHeader]) {
                        const key = excelHeadersToKeys[cleanHeader] as keyof StudentFormValues;
                        (student as any)[key] = row[header];
                    }
                }
                return student;
            });
            
            onImportStudents(newStudents);

        } catch (error) {
            console.error("Error parsing Excel file:", error);
            toast({
                variant: "destructive",
                title: "Gagal Membaca File",
                description: "Terjadi kesalahan saat memproses file Excel. Pastikan formatnya benar.",
            });
        }
    };
    reader.readAsArrayBuffer(file);
    if(fileInputRef.current) fileInputRef.current.value = '';
  };


  const renderStudentTable = (studentList: Student[], emptyStateMessage: string) => {
    if (studentList.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-lg">
          <h3 className="text-2xl font-bold tracking-tight">
            Tidak ada data siswa
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {emptyStateMessage}
          </p>
        </div>
      );
    }
    
    const isAllSelected = selectedIds.length > 0 && selectedIds.length === studentList.length;
    const isSomeSelected = selectedIds.length > 0 && selectedIds.length < studentList.length;

    const handleSelectAll = (checked: boolean) => {
      if (checked) {
        setSelectedIds(studentList.map(s => s.id));
      } else {
        setSelectedIds([]);
      }
    };
    
    const handleSelectRow = (id: string, checked: boolean) => {
      setSelectedIds(prev => 
        checked ? [...prev, id] : prev.filter(sid => sid !== id)
      );
    };


    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
               <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Pilih semua"
              />
            </TableHead>
            <TableHead>No. Urut</TableHead>
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
          {studentList.map((student, index) => (
            <TableRow key={student.id} data-state={selectedIds.includes(student.id) ? "selected" : ""}>
              <TableCell>
                 <Checkbox
                    checked={selectedIds.includes(student.id)}
                    onCheckedChange={(checked) => handleSelectRow(student.id, !!checked)}
                    aria-label={`Pilih ${student.namaLengkap}`}
                  />
              </TableCell>
              <TableCell>{index + 1}</TableCell>
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
                  Kelola, cari, filter, dan validasi data siswa yang terdaftar.
                </CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap">
                 <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".xlsx, .xls"
                  onChange={handleFileImport}
                />
                 <Button variant="outline" onClick={handleDownloadTemplate}>
                    <FileDown className="mr-2 h-4 w-4" />
                    Template
                </Button>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <FileUp className="mr-2 h-4 w-4" />
                    Impor
                </Button>
                <Button variant="outline" onClick={() => handleExportToExcel()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Ekspor
                </Button>
                <Button asChild>
                    <Link href="/dashboard/add-student">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Tambah Siswa
                    </Link>
                </Button>
            </div>
        </div>
         <div className="pt-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                  placeholder="Cari nama atau NISN..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={selectedIds.length > 0}
              />
          </div>
          {selectedIds.length > 0 ? (
            <div className="flex gap-2 items-center">
               <span className="text-sm text-muted-foreground">{selectedIds.length} dipilih</span>
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Aksi Massal
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onBulkUpdateStatus(selectedIds, 'Valid')}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Tandai Valid
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExportToExcel(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Ekspor Terpilih
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground" onClick={() => setBulkDeleteDialog(true)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus Terpilih
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex gap-4 flex-col sm:flex-row">
              <Popover>
                <PopoverTrigger asChild>
                  <Button id="date" variant={"outline"} className={cn("w-full sm:w-[260px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (date.to ? (<>{format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}</>) : (format(date.from, "LLL dd, y"))) : (<span>Pilih tanggal registrasi</span>)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2}/>
                </PopoverContent>
              </Popover>
              <Select value={completenessFilter} onValueChange={setCompletenessFilter}>
                  <SelectTrigger className="w-full sm:w-[220px]">
                      <SelectValue placeholder="Filter Kelengkapan Data" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="Semua">Semua Kelengkapan</SelectItem>
                      <SelectItem value="lengkap">Lengkap (&gt;80%)</SelectItem>
                      <SelectItem value="cukup">Cukup Lengkap (50-80%)</SelectItem>
                      <SelectItem value="kurang">Kurang Lengkap (&lt;50%)</SelectItem>
                  </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" disabled={selectedIds.length > 0}>Semua ({studentsByStatus.all.length})</TabsTrigger>
            <TabsTrigger value="unverified" disabled={selectedIds.length > 0}>Belum Diverifikasi ({studentsByStatus.unverified.length})</TabsTrigger>
            <TabsTrigger value="valid" disabled={selectedIds.length > 0}>Valid ({studentsByStatus.valid.length})</TabsTrigger>
            <TabsTrigger value="residual" disabled={selectedIds.length > 0}>Residu ({studentsByStatus.residual.length})</TabsTrigger>
          </TabsList>
            <div className="pt-4">
             {renderStudentTable(filteredStudents, activeTab === 'all' ? 'Klik tombol "Tambah Siswa" untuk memulai.' : 'Tidak ada siswa yang cocok dengan filter ini.')}
            </div>
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
            <AlertDialogAction onClick={handleSubmitDelete} className={buttonVariants({ variant: "destructive" })}>
              Hapus Permanen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    <AlertDialog open={bulkDeleteDialog} onOpenChange={setBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda Yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus <strong>{selectedIds.length} data siswa</strong> yang dipilih secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBulkDeleteDialog(false)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitBulkDelete} className={buttonVariants({ variant: "destructive" })}>
              Hapus Permanen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
