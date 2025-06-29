
"use client";

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentFormSchema, StudentFormValues } from '@/lib/schemas/student-schema';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const agamaOptions = ['Islam', 'Kristen/Protestan', 'Katholik', 'Hindu', 'Budha', 'Khonghucu', 'Kepercayaan Kepada Tuhan YME'];
const kebutuhanKhususOptions = [
  { id: 'Tidak', label: 'Tidak' }, { id: 'Netra (A)', label: 'Netra (A)' }, { id: 'Rungu (B)', label: 'Rungu (B)' },
  { id: 'Grahita ringan (C)', label: 'Grahita ringan (C)' }, { id: 'Grahita Sedang (C1)', label: 'Grahita Sedang (C1)' },
  { id: 'Daksa Ringan (D)', label: 'Daksa Ringan (D)' }, { id: 'Daksa Sedang (D1)', label: 'Daksa Sedang (D1)' },
  { id: 'Wicara (F)', label: 'Wicara (F)' }, { id: 'Tuna ganda (G)', label: 'Tuna ganda (G)' }, { id: 'Hiper aktif (H)', label: 'Hiper aktif (H)' },
  { id: 'Cerdas Istimewa (i)', label: 'Cerdas Istimewa (i)' }, { id: 'Bakat Istimewa (J)', label: 'Bakat Istimewa (J)' },
  { id: 'Kesulitan Belajar (K)', label: 'Kesulitan Belajar (K)' }, { id: 'Narkoba (N)', label: 'Narkoba (N)' },
  { id: 'Indigo (O)', label: 'Indigo (O)' }, { id: 'Down Sindrome (P)', label: 'Down Sindrome (P)' }, { id: 'Autis (Q)', label: 'Autis (Q)' },
];
const tempatTinggalOptions = ['Bersama orang tua', 'Wali', 'Kos', 'Asrama', 'Panti Asuhan', 'Pondok Pesantren'];
const modaTransportasiOptions = ['Jalan kaki', 'Kendaraan pribadi', 'Kendaraan Umum/angkot/Pete-pete', 'Jemputan Sekolah', 'Kereta Api', 'Ojek', 'Andong/Bendi/Sado/ Dokar/Delman/Beca', 'Perahu penyebrangan/Rakit/Getek', 'Lainnya'];
const pendidikanOptions = ['Tidak sekolah', 'Putus SD', 'SD Sederajat', 'SMP Sederajat', 'SMA Sederajat', 'D1', 'D2', 'D3', 'D4/S1', 'S2', 'S3'];
const pekerjaanOptions = ['Tidak bekerja', 'Nelayan', 'Petani', 'Peternak', 'PNS/TNI/POLRI', 'Karyawan Swasta', 'Pedagang Kecil', 'Pedagang Besar', 'Wiraswasta', 'Wirausaha', 'Buruh', 'Pensiunan'];
const penghasilanOptions = ['< Rp. 500.000', 'Rp. 500.000-Rp.999.999', 'Rp. 1.000.000-Rp.1.999.999', 'Rp.2.000.000-Rp.4.999.999', 'Rp.5.000.000-Rp.20.000.000', '> Rp.20.000.000', 'Tidak Berpenghasilan'];
const statusAnakOptions = ['Tidak', 'Yatim', 'Piatu', 'Yatim Piatu'];
const statusOrangTuaOptions = ['Masih Hidup', 'Meninggal Dunia'];

export function AddStudentForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      tanggalRegistrasi: new Date(),
      namaLengkap: '',
      jenisKelamin: 'Laki-laki',
      nisn: '',
      nis: '',
      nik: '',
      noKk: '',
      tempatLahir: '',
      tanggalLahir: undefined,
      noRegistrasiAktaLahir: '',
      agama: undefined,
      kewarganegaraan: 'WNI',
      namaNegara: '',
      berkebutuhanKhusus: [],
      alamatJalan: '',
      rt: '',
      rw: '',
      namaDusun: '',
      namaKelurahanDesa: '',
      kecamatan: '',
      kodePos: '',
      tempatTinggal: undefined,
      modaTransportasi: undefined,
      anakKeberapa: '',
      statusAnak: 'Tidak',
      punyaKip: undefined,
      namaAyah: '',
      statusAyah: 'Masih Hidup',
      nikAyah: '',
      tahunLahirAyah: '',
      pendidikanAyah: undefined,
      pekerjaanAyah: undefined,
      penghasilanAyah: undefined,
      berkebutuhanKhususAyah: [],
      namaIbu: '',
      statusIbu: 'Masih Hidup',
      nikIbu: '',
      tahunLahirIbu: '',
      pendidikanIbu: undefined,
      pekerjaanIbu: undefined,
      penghasilanIbu: undefined,
      berkebutuhanKhususIbu: [],
      namaWali: '',
      nikWali: '',
      tahunLahirWali: '',
      pendidikanWali: undefined,
      pekerjaanWali: undefined,
      penghasilanWali: undefined,
      nomorTeleponRumah: '',
      nomorHp: '',
      email: '',
      sekolahAsal: '',
      tinggiBadan: '',
      beratBadan: '',
      lingkarKepala: '',
      jumlahSaudaraKandung: '',
      jumlahSaudaraTiri: '',
      hobi: '',
      citaCita: '',
      statusValidasi: 'Belum Diverifikasi',
      catatanValidasi: '',
    },
  });

  const { watch } = form;
  const jumlahSaudaraKandung = watch('jumlahSaudaraKandung');
  const jumlahSaudaraTiri = watch('jumlahSaudaraTiri');
  const statusAyah = watch('statusAyah');
  const statusIbu = watch('statusIbu');

  const totalSaudara = useMemo(() => {
    const kandung = parseInt(jumlahSaudaraKandung || '0', 10);
    const tiri = parseInt(jumlahSaudaraTiri || '0', 10);
    return (isNaN(kandung) ? 0 : kandung) + (isNaN(tiri) ? 0 : tiri);
  }, [jumlahSaudaraKandung, jumlahSaudaraTiri]);


  async function onSubmit(data: StudentFormValues) {
    setIsLoading(true);
    try {
      const processedData: { [key: string]: any } = {
        ...data,
        tanggalRegistrasi: data.tanggalRegistrasi ? format(data.tanggalRegistrasi, 'yyyy-MM-dd') : null,
        tanggalLahir: data.tanggalLahir ? format(data.tanggalLahir, 'yyyy-MM-dd') : null,
        statusValidasi: 'Belum Diverifikasi',
      };
      
      // Firestore doesn't support 'undefined'. We'll convert them to 'null'.
      for (const key in processedData) {
        if (processedData[key] === undefined) {
          processedData[key] = null;
        }
      }

      await addDoc(collection(db, 'students'), processedData);
      toast({
        title: 'Sukses',
        description: 'Data siswa baru berhasil disimpan.',
      });
      router.push('/dashboard/students');
    } catch (error) {
      console.error('Error adding document: ', error);
      toast({
        variant: 'destructive',
        title: 'Gagal',
        description: 'Terjadi kesalahan saat menyimpan data.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const renderSelect = (name: any, label: string, options: string[], placeholder?: string, disabled?: boolean) => (
    <FormField control={form.control} name={name} render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
          <FormControl>
            <SelectTrigger><SelectValue placeholder={placeholder || `Pilih ${label.toLowerCase()}`} /></SelectTrigger>
          </FormControl>
          <SelectContent>{options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )} />
  );

  const renderInput = (name: any, label: string, placeholder: string, type = "text", disabled?: boolean) => (
    <FormField control={form.control} name={name} render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl><Input placeholder={placeholder} {...field} value={field.value || ''} type={type} disabled={disabled} /></FormControl>
        <FormMessage />
      </FormItem>
    )} />
  );

  const renderDate = (name: any, label: string) => (
    <FormField control={form.control} name={name} render={({ field }) => (
      <FormItem className="flex flex-col">
        <FormLabel>{label}</FormLabel>
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                {field.value ? (format(field.value, "PPP", { locale: id })) : (<span>Pilih tanggal</span>)}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
          </PopoverContent>
        </Popover>
        <FormMessage />
      </FormItem>
    )} />
  );

  const renderCheckboxGroup = (name: any, label: string, options: { id: string, label: string }[], disabled?: boolean) => (
    <FormField control={form.control} name={name} render={() => (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <div className="space-y-2 rounded-md border p-4">
                {options.map((item) => (
                    <FormField key={item.id} control={form.control} name={name} render={({ field }) => (
                        <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                        return checked
                                            ? field.onChange([...(field.value || []), item.id])
                                            : field.onChange(field.value?.filter((value: string) => value !== item.id));
                                    }}
                                    disabled={disabled}
                                />
                            </FormControl>
                            <FormLabel className="font-normal">{item.label}</FormLabel>
                        </FormItem>
                    )}
                    />
                ))}
            </div>
            <FormMessage/>
        </FormItem>
    )} />
  );


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold">Formulir Pendaftaran Siswa Baru</h2>
        <Tabs defaultValue="dataPribadi" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
                <TabsTrigger value="dataPribadi">Data Pribadi</TabsTrigger>
                <TabsTrigger value="dataAyah">Data Ayah</TabsTrigger>
                <TabsTrigger value="dataIbu">Data Ibu</TabsTrigger>
                <TabsTrigger value="dataWali">Data Wali</TabsTrigger>
                <TabsTrigger value="kontak">Kontak</TabsTrigger>
            </TabsList>

            <TabsContent value="dataPribadi">
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3 pt-6">
                    {renderDate('tanggalRegistrasi', 'Tanggal Registrasi')}
                    {renderInput('namaLengkap', 'Nama Lengkap', 'Sesuai akta/ijazah')}
                    <FormField control={form.control} name="jenisKelamin" render={({ field }) => (
                    <FormItem><FormLabel>Jenis Kelamin</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4 pt-2">
                        <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="Laki-laki" /></FormControl><FormLabel className="font-normal">Laki-laki</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="Perempuan" /></FormControl><FormLabel className="font-normal">Perempuan</FormLabel></FormItem>
                    </RadioGroup></FormControl><FormMessage /></FormItem>
                    )} />
                    {renderInput('nisn', 'NISN', 'Contoh: 0009321234')}
                    {renderInput('nis', 'NIS', 'Nomor Induk Siswa')}
                    {renderSelect('statusAnak', 'Status Yatim/Piatu', statusAnakOptions)}
                    {renderInput('nik', 'NIK', '16 digit NIK siswa')}
                    {renderInput('noKk', 'No. Kartu Keluarga', '16 digit No. KK')}
                    {renderInput('noRegistrasiAktaLahir', 'No. Registasi Akta Lahir', 'Nomor pada akta kelahiran')}
                    {renderInput('tempatLahir', 'Tempat Lahir', 'Sesuai dokumen resmi')}
                    {renderDate('tanggalLahir', 'Tanggal Lahir')}
                    {renderSelect('agama', 'Agama & Kepercayaan', agamaOptions, 'Pilih agama')}
                    <FormField control={form.control} name="kewarganegaraan" render={({ field }) => (
                    <FormItem><FormLabel>Kewarganegaraan</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4 pt-2">
                        <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="WNI" /></FormControl><FormLabel className="font-normal">WNI</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="WNA" /></FormControl><FormLabel className="font-normal">WNA</FormLabel></FormItem>
                    </RadioGroup></FormControl><FormMessage /></FormItem>
                    )} />
                    {form.watch('kewarganegaraan') === 'WNA' && renderInput('namaNegara', 'Nama Negara', 'Masukkan nama negara')}
                    {renderInput('alamatJalan', 'Alamat Jalan', 'Jl. Pendidikan No. 1')}
                    {renderInput('rt', 'RT', '001')}
                    {renderInput('rw', 'RW', '002')}
                    {renderInput('namaDusun', 'Nama Dusun', 'Contoh: Cempaka')}
                    {renderInput('namaKelurahanDesa', 'Nama Kelurahan/Desa', 'Contoh: Bayongbong')}
                    {renderInput('kecamatan', 'Kecamatan', 'Contoh: Garut Kota')}
                    {renderInput('kodePos', 'Kode Pos', 'Contoh: 44100')}
                    {renderSelect('tempatTinggal', 'Tempat Tinggal', tempatTinggalOptions, 'Pilih tempat tinggal')}
                    {renderSelect('modaTransportasi', 'Moda Transportasi', modaTransportasiOptions, 'Pilih moda transportasi')}
                    {renderInput('anakKeberapa', 'Anak Ke-berapa', 'Urutan pada Kartu Keluarga', 'number')}
                    <FormField control={form.control} name="punyaKip" render={({ field }) => (
                    <FormItem><FormLabel>Punya KIP?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4 pt-2">
                        <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="Ya" /></FormControl><FormLabel className="font-normal">Ya</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="Tidak" /></FormControl><FormLabel className="font-normal">Tidak</FormLabel></FormItem>
                    </RadioGroup></FormControl><FormMessage /></FormItem>
                    )} />
                    {renderInput('sekolahAsal', 'Asal Sekolah SMP/MTs', 'Nama sekolah sebelumnya')}
                    {renderInput('tinggiBadan', 'Tinggi Badan (cm)', 'Contoh: 160', 'number')}
                    {renderInput('beratBadan', 'Berat Badan (kg)', 'Contoh: 50', 'number')}
                    {renderInput('lingkarKepala', 'Lingkar Kepala (cm)', 'Contoh: 55', 'number')}
                    {renderInput('jumlahSaudaraKandung', 'Jumlah Saudara Kandung', 'Contoh: 2', 'number')}
                    {renderInput('jumlahSaudaraTiri', 'Jumlah Saudara Tiri', 'Contoh: 1', 'number')}
                     <FormItem>
                        <FormLabel>Total Saudara</FormLabel>
                        <FormControl>
                            <Input value={totalSaudara} disabled className="bg-muted" />
                        </FormControl>
                        <FormDescription>Dihitung otomatis dari saudara kandung & tiri.</FormDescription>
                    </FormItem>
                    {renderInput('hobi', 'Hobi', 'Contoh: Membaca buku')}
                    {renderInput('citaCita', 'Cita-cita', 'Contoh: Dokter')}
                    <div className="md:col-span-2 lg:col-span-3">
                    {renderCheckboxGroup('berkebutuhanKhusus', 'Berkebutuhan Khusus Siswa', kebutuhanKhususOptions)}
                    </div>
                </div>
            </TabsContent>
            
            <TabsContent value="dataAyah">
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3 pt-6">
                    {renderInput('namaAyah', 'Nama Ayah Kandung', 'Tanpa gelar')}
                    {renderSelect('statusAyah', 'Status Ayah', statusOrangTuaOptions)}
                    {renderInput('nikAyah', 'NIK Ayah', '16 digit NIK', 'text', statusAyah === 'Meninggal Dunia')}
                    {renderInput('tahunLahirAyah', 'Tahun Lahir Ayah', 'Contoh: 1970', 'number', statusAyah === 'Meninggal Dunia')}
                    {renderSelect('pendidikanAyah', 'Pendidikan Terakhir Ayah', pendidikanOptions, 'Pilih pendidikan', statusAyah === 'Meninggal Dunia')}
                    {renderSelect('pekerjaanAyah', 'Pekerjaan Ayah', pekerjaanOptions, 'Pilih pekerjaan', statusAyah === 'Meninggal Dunia')}
                    {renderSelect('penghasilanAyah', 'Penghasilan Bulanan Ayah', penghasilanOptions, 'Pilih penghasilan', statusAyah === 'Meninggal Dunia')}
                    <div className="md:col-span-2 lg:col-span-3">
                    {renderCheckboxGroup('berkebutuhanKhususAyah', 'Berkebutuhan Khusus Ayah', kebutuhanKhususOptions, statusAyah === 'Meninggal Dunia')}
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="dataIbu">
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3 pt-6">
                    {renderInput('namaIbu', 'Nama Ibu Kandung', 'Sesuai akta/ijazah')}
                    {renderSelect('statusIbu', 'Status Ibu', statusOrangTuaOptions)}
                    {renderInput('nikIbu', 'NIK Ibu', '16 digit NIK', 'text', statusIbu === 'Meninggal Dunia')}
                    {renderInput('tahunLahirIbu', 'Tahun Lahir Ibu', 'Contoh: 1975', 'number', statusIbu === 'Meninggal Dunia')}
                    {renderSelect('pendidikanIbu', 'Pendidikan Terakhir Ibu', pendidikanOptions, 'Pilih pendidikan', statusIbu === 'Meninggal Dunia')}
                    {renderSelect('pekerjaanIbu', 'Pekerjaan Ibu', pekerjaanOptions, 'Pilih pekerjaan', statusIbu === 'Meninggal Dunia')}
                    {renderSelect('penghasilanIbu', 'Penghasilan Bulanan Ibu', penghasilanOptions, 'Pilih penghasilan', statusIbu === 'Meninggal Dunia')}
                    <div className="md:col-span-2 lg:col-span-3">
                    {renderCheckboxGroup('berkebutuhanKhususIbu', 'Berkebutuhan Khusus Ibu', kebutuhanKhususOptions, statusIbu === 'Meninggal Dunia')}
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="dataWali">
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3 pt-6">
                    {renderInput('namaWali', 'Nama Wali', 'Boleh dikosongkan')}
                    {renderInput('nikWali', 'NIK Wali', '16 digit NIK')}
                    {renderInput('tahunLahirWali', 'Tahun Lahir Wali', 'Contoh: 1980', 'number')}
                    {renderSelect('pendidikanWali', 'Pendidikan Terakhir Wali', pendidikanOptions, 'Pilih pendidikan')}
                    {renderSelect('pekerjaanWali', 'Pekerjaan Wali', pekerjaanOptions, 'Pilih pekerjaan')}
                    {renderSelect('penghasilanWali', 'Penghasilan Bulanan Wali', penghasilanOptions, 'Pilih penghasilan')}
                </div>
            </TabsContent>

            <TabsContent value="kontak">
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3 pt-6">
                    {renderInput('nomorTeleponRumah', 'Nomor Telepon Rumah', 'Milik pribadi/orang tua/wali')}
                    {renderInput('nomorHp', 'Nomor HP', 'Milik pribadi/orang tua/wali')}
                    {renderInput('email', 'Email', 'contoh@email.com', 'email')}
                </div>
            </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Data Siswa
          </Button>
        </div>
      </form>
    </Form>
  );
}
