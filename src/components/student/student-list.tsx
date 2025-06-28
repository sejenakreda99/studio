
"use client";

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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Student } from '@/types/student';

interface StudentListProps {
  students: Student[];
}

export function StudentList({ students }: StudentListProps) {
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
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Daftar Siswa</CardTitle>
                <CardDescription>
                Kelola data siswa yang terdaftar di sekolah.
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
        {students.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-lg">
             <h3 className="text-2xl font-bold tracking-tight">
               Belum ada data siswa
             </h3>
             <p className="mt-2 text-sm text-muted-foreground">
               Klik tombol "Tambah Siswa" untuk memulai.
             </p>
           </div>
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Lengkap</TableHead>
              <TableHead className="hidden md:table-cell">NISN</TableHead>
              <TableHead className="hidden md:table-cell">NIS</TableHead>
              <TableHead className="hidden sm:table-cell">Jenis Kelamin</TableHead>
              <TableHead className="hidden lg:table-cell">Tanggal Lahir</TableHead>
              <TableHead className="hidden md:table-cell">Status Anak</TableHead>
              <TableHead>
                <span className="sr-only">Aksi</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.namaLengkap}</TableCell>
                <TableCell className="hidden md:table-cell">{student.nisn || '-'}</TableCell>
                <TableCell className="hidden md:table-cell">{student.nis || '-'}</TableCell>
                <TableCell className="hidden sm:table-cell">
                   <Badge variant={student.jenisKelamin === 'Laki-laki' ? 'default' : 'secondary'}>
                    {student.jenisKelamin}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">{formatDate(student.tanggalLahir)}</TableCell>
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
                      <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Hapus</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </CardContent>
    </Card>
  );
}
