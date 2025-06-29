
"use client"

import { useMemo } from 'react';
import type { Student } from '@/types/student';
import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { startOfMonth } from 'date-fns';
import { Users, UserCheck, UserX, Users2, FileBarChart, PieChartIcon, FileCheck } from 'lucide-react';
import { studentFormSchema } from '@/lib/schemas/student-schema';
import Link from 'next/link';


interface StatsDashboardProps {
  students: Student[];
}

const GENDER_COLORS = { 'Laki-laki': 'hsl(var(--chart-1))', 'Perempuan': 'hsl(var(--chart-2))' };
const STATUS_COLORS = { 'Valid': 'hsl(var(--chart-1))', 'Residu': 'hsl(var(--chart-5))', 'Belum Diverifikasi': 'hsl(var(--chart-3))' };
const COMPLETENESS_COLORS = { 'Lengkap (>80%)': 'hsl(var(--chart-2))', 'Cukup (50-80%)': 'hsl(var(--chart-4))', 'Kurang (<50%)': 'hsl(var(--chart-5))' };

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


export function StatsDashboard({ students }: StatsDashboardProps) {
  const stats = useMemo(() => {
    const now = new Date();
    const startOfThisMonth = startOfMonth(now);
    
    let valid = 0;
    let residu = 0;
    let unverified = 0;
    let male = 0;
    let female = 0;
    let newThisMonth = 0;
    let lengkap = 0;
    let cukup = 0;
    let kurang = 0;

    students.forEach(student => {
      // Validation Status
      if (student.statusValidasi === 'Valid') valid++;
      else if (student.statusValidasi === 'Residu') residu++;
      else unverified++;

      // Gender
      if (student.jenisKelamin === 'Laki-laki') male++;
      else if (student.jenisKelamin === 'Perempuan') female++;
      
      // New This Month
      if (student.tanggalRegistrasi) {
        const regDate = new Date(student.tanggalRegistrasi);
        if (regDate >= startOfThisMonth) {
          newThisMonth++;
        }
      }

      // Data Completeness
      const completeness = calculateCompleteness(student);
      if (completeness > 80) lengkap++;
      else if (completeness >= 50) cukup++;
      else kurang++;
    });

    return {
      total: students.length,
      valid,
      residu,
      unverified,
      newThisMonth,
      genderData: [
        { name: 'Laki-laki', total: male, fill: GENDER_COLORS['Laki-laki'] },
        { name: 'Perempuan', total: female, fill: GENDER_COLORS['Perempuan'] },
      ],
      validationData: [
        { name: 'Valid', value: valid, fill: STATUS_COLORS['Valid'] },
        { name: 'Residu', value: residu, fill: STATUS_COLORS['Residu'] },
        { name: 'Belum Diverifikasi', value: unverified, fill: STATUS_COLORS['Belum Diverifikasi'] },
      ],
      completenessData: [
        { name: 'Lengkap (>80%)', total: lengkap, fill: COMPLETENESS_COLORS['Lengkap (>80%)'] },
        { name: 'Cukup (50-80%)', total: cukup, fill: COMPLETENESS_COLORS['Cukup (50-80%)'] },
        { name: 'Kurang (<50%)', total: kurang, fill: COMPLETENESS_COLORS['Kurang (<50%)'] },
      ],
    };
  }, [students]);

  return (
    <div className="flex flex-col gap-6">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/students?status=all">
          <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Jumlah seluruh siswa terdaftar</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/students?status=valid">
          <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Valid</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.valid}</div>
              <p className="text-xs text-muted-foreground">Siswa dengan data terverifikasi</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/students?status=residual">
          <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Residu</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.residu}</div>
              <p className="text-xs text-muted-foreground">Siswa dengan data perlu perbaikan</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/students">
          <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendaftar Bulan Ini</CardTitle>
              <Users2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{stats.newThisMonth}</div>
              <p className="text-xs text-muted-foreground">Siswa yang mendaftar bulan ini</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
             <div className="flex items-center gap-2">
                <FileBarChart className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Distribusi Gender</CardTitle>
            </div>
            <CardDescription>Perbandingan jumlah siswa laki-laki dan perempuan.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={{}} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={stats.genderData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis />
                <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="total" radius={8}>
                    {stats.genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
         <Card className="col-span-1">
          <CardHeader>
             <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Kelengkapan Data</CardTitle>
            </div>
            <CardDescription>Distribusi siswa berdasarkan kelengkapan data.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={{}} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={stats.completenessData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis />
                <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="total" radius={8}>
                    {stats.completenessData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
             <div className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Status Validasi Data</CardTitle>
            </div>
            <CardDescription>Proporsi data siswa berdasarkan status validasi.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
             <ChartContainer
              config={{}}
              className="mx-auto aspect-square h-[250px]"
            >
              <PieChart>
                <Tooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={stats.validationData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
                >
                   {stats.validationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend content={({ payload }) => {
                    return (
                        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-sm">
                        {payload?.map((entry, index) => (
                            <li key={`item-${index}`} className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full" style={{backgroundColor: entry.color}}/>
                                <span>{entry.value}</span>
                            </li>
                        ))}
                        </ul>
                    )
                }}/>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
