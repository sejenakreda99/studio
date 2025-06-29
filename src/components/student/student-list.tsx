
"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { MoreHorizontal, UserPlus } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface StudentListProps {
  students: Student[];
  onUpdateStatus: (studentId: string, status: string, catatan?: string) => Promise<void>;
}

export function StudentList({ students, onUpdateStatus }: StudentListProps) {
  const [dialogState, setDialogState] = useState<{ open: boolean; studentId: string | null }>({ open: false, studentId: null });
  const [catatan, setCatatan] = useState('');

  const handleOpenResiduDialog = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    setDialogState({ open: true, studentId });
    setCatatan(student?.catatanValidasi || '');
  };
  
  const handleSubmitResidu = async () => {
    if (dialogState.studentId) {
      await onUpdateStatus(dialogState.studentId, 'Residu', catatan);
      setDialogState({ open: false, studentId: null });
    }
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
                 {student.statusValidasi === 'Residu' && student.catatanValidasi ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="destructive" className="cursor-help">{student.statusValidasi}</Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{student.catatanValidasi}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <Badge variant={
                    student.statusValidasi === 'Valid' ? 'default' : 
                    student.statusValidasi === 'Residu' ? 'destructive' : 'secondary'
                  }>
                    {student.statusValidasi}
                  </Badge>
                )}
              </TableCell>
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
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Hapus</DropdownMenuItem>
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
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Daftar Siswa</CardTitle>
                <CardDescription>
                  Kelola dan validasi data siswa yang terdaftar di sekolah.
                </CardDescription>
            </div>
            <Button asChild>
                <Link href="/dashboard/add-student">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Tambah Siswa
                </Link>
            </Button>
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
    <AlertDialog open={dialogState.open} onOpenChange={(open) => setDialogState({ ...dialogState, open })}>
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
            <AlertDialogCancel onClick={() => setDialogState({ open: false, studentId: null })}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitResidu}>Simpan Catatan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
