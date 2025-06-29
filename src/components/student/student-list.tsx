
"use client";

import { useMemo } from 'react';
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

interface StudentListProps {
  students: Student[];
  onUpdateStatus: (studentId: string, status: string) => Promise<void>;
}

export function StudentList({ students, onUpdateStatus }: StudentListProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    // Manually parse yyyy-MM-dd to avoid timezone issues
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
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
                 <Badge variant={
                    student.statusValidasi === 'Valid' ? 'default' : 
                    student.statusValidasi === 'Residu' ? 'destructive' : 'secondary'
                  }>
                    {student.statusValidasi}
                  </Badge>
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
                    <DropdownMenuItem onClick={() => onUpdateStatus(student.id, 'Residu')}>
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
  );
}
