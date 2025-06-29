
"use client"

import { useMemo } from 'react';
import type { Student } from '@/types/student';
import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Map, Briefcase, Calendar, CreditCard, Wallet, HeartHandshake, HelpingHand, MapPin } from 'lucide-react';

interface ReportsDashboardProps {
  students: Student[];
}

const COLORS = [
  'hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 
  'hsl(var(--chart-4))', 'hsl(var(--chart-5))', '#FFC300', '#DAF7A6', '#C70039'
];

const incomeOrder = [
    '< Rp. 500.000', 
    'Rp. 500.000-Rp.999.999', 
    'Rp. 1.000.000-Rp.1.999.999', 
    'Rp.2.000.000-Rp.4.999.999', 
    'Rp.5.000.000-Rp.20.000.000', 
    '> Rp.20.000.000', 
    'Tidak Berpenghasilan'
];
const orphanOrder = ['Yatim Piatu', 'Yatim', 'Piatu', 'Tidak'];


export function ReportsDashboard({ students }: ReportsDashboardProps) {
  const reportData = useMemo(() => {
    const districtData: { [key: string]: number } = {};
    const villageData: { [key: string]: number } = {};
    const parentOccupationData: { [key: string]: number } = {};
    const registrationTrendData: { [key: string]: number } = {};
    const kipData: { [key: string]: number } = { 'Punya KIP': 0, 'Tidak Punya KIP': 0 };
    const parentIncomeData: { [key: string]: number } = {};
    const orphanStatusData: { [key: string]: number } = {};
    let underprivilegedStudents = 0;

    students.forEach(student => {
      // District Data
      const district = student.kecamatan || 'Tidak Diketahui';
      districtData[district] = (districtData[district] || 0) + 1;
      
      // Village Data
      const village = student.namaKelurahanDesa || 'Tidak Diketahui';
      villageData[village] = (villageData[village] || 0) + 1;

      // Parent Occupation Data
      const fatherJob = student.pekerjaanAyah || 'Tidak Bekerja';
      const motherJob = student.pekerjaanIbu || 'Tidak Bekerja';
      if (fatherJob !== 'Tidak Bekerja') parentOccupationData[fatherJob] = (parentOccupationData[fatherJob] || 0) + 1;
      if (motherJob !== 'Tidak Bekerja') parentOccupationData[motherJob] = (parentOccupationData[motherJob] || 0) + 1;

      // Registration Trend Data
      if (student.tanggalRegistrasi) {
        const year = new Date(student.tanggalRegistrasi).getFullYear().toString();
        registrationTrendData[year] = (registrationTrendData[year] || 0) + 1;
      }
      
      // KIP Data
      if (student.punyaKip === 'Ya') {
          kipData['Punya KIP']++;
      } else {
          kipData['Tidak Punya KIP']++;
      }
      
      // Orphan Status Data
      const orphanStatus = student.statusAnak || 'Tidak';
      orphanStatusData[orphanStatus] = (orphanStatusData[orphanStatus] || 0) + 1;

      // Parent Income & Underprivileged (based on Father's income only)
      const fatherIncome = student.penghasilanAyah;
      const lowIncomeBrackets = ['< Rp. 500.000', 'Rp. 500.000-Rp.999.999'];

      if (fatherIncome && lowIncomeBrackets.includes(fatherIncome)) {
        underprivilegedStudents++;
      }
      
      if (fatherIncome && fatherIncome !== 'Tidak Berpenghasilan') {
        parentIncomeData[fatherIncome] = (parentIncomeData[fatherIncome] || 0) + 1;
      }
    });

    const sortedDistrict = Object.entries(districtData).sort((a, b) => b[1] - a[1]).map(([name, total]) => ({ name, total }));
    const sortedVillage = Object.entries(villageData).sort((a, b) => b[1] - a[1]).map(([name, total]) => ({ name, total }));
    const sortedParentOccupation = Object.entries(parentOccupationData).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([name, value], index) => ({ name, value, fill: COLORS[index % COLORS.length] }));
    const sortedRegistrationTrend = Object.entries(registrationTrendData).sort((a, b) => parseInt(a[0]) - parseInt(b[0])).map(([name, total]) => ({ name, total }));
    
    const formattedKipData = Object.entries(kipData).map(([name, value], index) => ({ name, value, fill: [ 'hsl(var(--chart-2))', 'hsl(var(--chart-4))'][index] }));
    const formattedOrphanData = Object.entries(orphanStatusData).sort((a,b) => orphanOrder.indexOf(a[0]) - orphanOrder.indexOf(b[0])).map(([name, value], index) => ({ name, value, fill: COLORS[index % COLORS.length] }));
    const formattedUnderprivilegedData = [
        { name: 'Kurang Mampu', value: underprivilegedStudents, fill: 'hsl(var(--chart-5))' },
        { name: 'Mampu', value: students.length - underprivilegedStudents, fill: 'hsl(var(--chart-1))' }
    ];
    const sortedParentIncome = Object.entries(parentIncomeData)
        .sort((a, b) => incomeOrder.indexOf(a[0]) - incomeOrder.indexOf(b[0]))
        .map(([name, total]) => ({ name, total }));

    return {
      districtData: sortedDistrict,
      villageData: sortedVillage,
      parentOccupationData: sortedParentOccupation,
      registrationTrendData: sortedRegistrationTrend,
      kipData: formattedKipData,
      orphanStatusData: formattedOrphanData,
      underprivilegedData: formattedUnderprivilegedData,
      parentIncomeData: sortedParentIncome,
    };
  }, [students]);

  const renderPieChart = (data: any[], title: string, description: string, Icon: React.ElementType) => (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-muted-foreground" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="mx-auto aspect-square h-[250px]">
          <PieChart>
            <Tooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              labelLine={false}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                return (percent * 100) > 5 ? (
                  <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12">
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                ) : null;
              }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Legend content={({ payload }) => (
              <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-sm">
                {payload?.map((entry, index) => (
                  <li key={`item-${index}`} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span>{entry.value}</span>
                  </li>
                ))}
              </ul>
            )} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold tracking-tight">Laporan & Analisis Data Siswa</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Map className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Distribusi Siswa per Kecamatan</CardTitle>
                    </div>
                    <CardDescription>Visualisasi jumlah siswa berdasarkan asal kecamatan mereka.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{}} className="h-[350px] w-full">
                    <ResponsiveContainer>
                        <BarChart data={reportData.districtData} layout="vertical" margin={{ left: 30, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                            <Tooltip content={<ChartTooltipContent hideLabel />} cursor={{ fill: 'hsl(var(--muted))' }} />
                            <Bar dataKey="total" name="Jumlah Siswa" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Distribusi Siswa per Desa</CardTitle>
                    </div>
                    <CardDescription>Visualisasi jumlah siswa berdasarkan asal desa/kelurahan.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{}} className="h-[350px] w-full">
                    <ResponsiveContainer>
                        <BarChart data={reportData.villageData} layout="vertical" margin={{ left: 30, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                            <Tooltip content={<ChartTooltipContent hideLabel />} cursor={{ fill: 'hsl(var(--muted))' }} />
                            <Bar dataKey="total" name="Jumlah Siswa" fill="hsl(var(--chart-3))" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
             <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Distribusi Pekerjaan Orang Tua</CardTitle>
                    </div>
                    <CardDescription>7 jenis pekerjaan teratas orang tua siswa.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={{}} className="mx-auto aspect-square h-[350px]">
                        <PieChart>
                            <Tooltip content={<ChartTooltipContent hideLabel />} />
                            <Pie
                                data={reportData.parentOccupationData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                labelLine={false}
                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                    return (percent * 100) > 5 ? (
                                        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12">
                                            {`${(percent * 100).toFixed(0)}%`}
                                        </text>
                                    ) : null;
                                }}
                            >
                                {reportData.parentOccupationData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Legend content={({ payload }) => (
                                 <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-xs">
                                    {payload?.map((entry, index) => (
                                        <li key={`item-${index}`} className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full" style={{backgroundColor: entry.color}}/>
                                            <span>{entry.value}</span>
                                        </li>
                                    ))}
                                </ul>
                            )} />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Tren Pendaftaran Siswa per Tahun</CardTitle>
                    </div>
                    <CardDescription>Jumlah siswa baru yang mendaftar setiap tahunnya.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{}} className="h-[350px] w-full">
                    <ResponsiveContainer>
                        <BarChart data={reportData.registrationTrendData}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                            <YAxis />
                            <Tooltip content={<ChartTooltipContent hideLabel />} cursor={{ fill: 'hsl(var(--muted))' }} />
                            <Bar dataKey="total" name="Pendaftar Baru" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
           {renderPieChart(reportData.kipData, "Kepemilikan KIP", "Distribusi siswa yang memiliki Kartu Indonesia Pintar (KIP).", CreditCard)}
           {renderPieChart(reportData.orphanStatusData, "Status Yatim Piatu", "Distribusi status anak (yatim, piatu, dll).", HeartHandshake)}
           {renderPieChart(reportData.underprivilegedData, "Siswa Kurang Mampu", "Berdasarkan penghasilan Ayah di bawah Rp 1.000.000.", HelpingHand)}
        </div>

         <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Rentang Penghasilan Ayah</CardTitle>
                    </div>
                    <CardDescription>Distribusi rentang penghasilan bulanan Ayah.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{}} className="h-[350px] w-full">
                        <ResponsiveContainer>
                            <BarChart data={reportData.parentIncomeData} layout="vertical" margin={{ left: 40, right: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                                <Tooltip content={<ChartTooltipContent hideLabel />} cursor={{ fill: 'hsl(var(--muted))' }} />
                                <Bar dataKey="total" name="Jumlah Ayah" fill="hsl(var(--chart-4))" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
