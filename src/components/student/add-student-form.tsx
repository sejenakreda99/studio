"use client";

import { useState } from 'react';
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
const pekerjaanOptions = ['Tidak bekerja', 'Nelayan', 'Petani', 'Peternak', 'PNS/TNI/POLRI', 'Karyawan Swasta', 'Pedagang Kecil', 'Pedagang Besar', 'Wiraswasta', 'Wirausaha', 'Buruh', 'Pensiunan', 'Meninggal Dunia'];
const penghasilanOptions = ['< Rp. 500.000', 'Rp. 500.000-Rp.999.999', 'Rp. 1.000.000-Rp.1.999.999', 'Rp.2.000.000-Rp.4.999.999', 'Rp.5.000.000-Rp.20.000.000', '> Rp.20.000.000', 'Tidak Berpenghasilan'];

const FormSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <AccordionItem value={title}>
    <AccordionTrigger className="text-lg font-semibold">{title}</AccordionTrigger>
    <AccordionContent>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </AccordionContent>
  </AccordionItem>
);

export function AddStudentForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      kewarganegaraan: 'WNI',
      berkebutuhanKhusus: [],
      berkebutuhanKhususAyah: [],
      berkebutuhanKhususIbu: [],
      tanggalRegistrasi: new Date(),
    },
  });

  async function onSubmit(data: StudentFormValues) {
    setIsLoading(true);
    try {
      const processedData = {
        ...data,
        tanggalRegistrasi: data.tanggalRegistrasi ? format(data.tanggalRegistrasi, 'yyyy-MM-dd') : null,
        tanggalLahir: data.tanggalLahir ? format(data.tanggalLahir, 'yyyy-MM-dd') : null,
      };
      await addDoc(collection(db, 'students'), processedData);
      toast({
        title: 'Sukses',
        description: 'Data siswa baru berhasil disimpan.',
      });
      router.push('/dashboard');
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

  const renderSelect = (name: any, label: string, options: string[]) => (
    <FormField control={form.control} name={name} render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger><SelectValue placeholder={`Pilih ${label.toLowerCase()}`} /></SelectTrigger>
          </FormControl>
          <SelectContent>{options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )} />
  );

  const renderInput = (name: any, label: string, placeholder: string, type = "text") => (
    <FormField control={form.control} name={name} render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl><Input placeholder={placeholder} {...field} type={type} /></FormControl>
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

  const renderCheckboxGroup = (name: any, label: string, options: { id: string, label: string }[]) => (
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
        <Accordion type="multiple" defaultValue={['Data Pribadi']} className="w-full">
          <FormSection title="Data Pribadi">
            {renderDate('tanggalRegistrasi', 'Tanggal Registrasi')}
            {renderInput('namaLengkap', 'Nama Lengkap', 'Sesuai akta/ijazah')}
            <FormField control={form.control} name="jenisKelamin" render={({ field }) => (
              <FormItem><FormLabel>Jenis Kelamin</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4 pt-2">
                <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="Laki-laki" /></FormControl><FormLabel className="font-normal">Laki-laki</FormLabel></FormItem>
                <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="Perempuan" /></FormControl><FormLabel className="font-normal">Perempuan</FormLabel></FormItem>
              </RadioGroup></FormControl><FormMessage /></FormItem>
            )} />
            {renderInput('nisn', 'NISN', 'Contoh: 0009321234')}
            {renderInput('nik', 'NIK', '16 digit NIK siswa')}
            {renderInput('noKk', 'No. Kartu Keluarga', '16 digit No. KK')}
            {renderInput('tempatLahir', 'Tempat Lahir', 'Sesuai dokumen resmi')}
            {renderDate('tanggalLahir', 'Tanggal Lahir')}
            {renderInput('noRegistrasiAktaLahir', 'No. Registasi Akta Lahir', 'Nomor pada akta kelahiran')}
            {renderSelect('agama', 'Agama & Kepercayaan', agamaOptions)}
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
            {renderSelect('tempatTinggal', 'Tempat Tinggal', tempatTinggalOptions)}
            {renderSelect('modaTransportasi', 'Moda Transportasi', modaTransportasiOptions)}
            {renderInput('anakKeberapa', 'Anak Ke-berapa', 'Urutan pada Kartu Keluarga')}
            <FormField control={form.control} name="punyaKip" render={({ field }) => (
              <FormItem><FormLabel>Punya KIP?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4 pt-2">
                <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="Ya" /></FormControl><FormLabel className="font-normal">Ya</FormLabel></FormItem>
                <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="Tidak" /></FormControl><FormLabel className="font-normal">Tidak</FormLabel></FormItem>
              </RadioGroup></FormControl><FormMessage /></FormItem>
            )} />
            <div className="md:col-span-2 lg:col-span-3">
              {renderCheckboxGroup('berkebutuhanKhusus', 'Berkebutuhan Khusus', kebutuhanKhususOptions)}
            </div>
          </FormSection>

          <FormSection title="Data Ayah Kandung">
            {renderInput('namaAyah', 'Nama Ayah Kandung', 'Tanpa gelar')}
            {renderInput('nikAyah', 'NIK Ayah', '16 digit NIK')}
            {renderInput('tahunLahirAyah', 'Tahun Lahir Ayah', 'Contoh: 1970')}
            {renderSelect('pendidikanAyah', 'Pendidikan Terakhir Ayah', pendidikanOptions)}
            {renderSelect('pekerjaanAyah', 'Pekerjaan Ayah', pekerjaanOptions)}
            {renderSelect('penghasilanAyah', 'Penghasilan Bulanan Ayah', penghasilanOptions)}
            <div className="md:col-span-2 lg:col-span-3">
              {renderCheckboxGroup('berkebutuhanKhususAyah', 'Berkebutuhan Khusus Ayah', kebutuhanKhususOptions)}
            </div>
          </FormSection>
          
          <FormSection title="Data Ibu Kandung">
            {renderInput('namaIbu', 'Nama Ibu Kandung', 'Sesuai akta/ijazah')}
            {renderInput('nikIbu', 'NIK Ibu', '16 digit NIK')}
            {renderInput('tahunLahirIbu', 'Tahun Lahir Ibu', 'Contoh: 1975')}
            {renderSelect('pendidikanIbu', 'Pendidikan Terakhir Ibu', pendidikanOptions)}
            {renderSelect('pekerjaanIbu', 'Pekerjaan Ibu', pekerjaanOptions)}
            {renderSelect('penghasilanIbu', 'Penghasilan Bulanan Ibu', penghasilanOptions)}
             <div className="md:col-span-2 lg:col-span-3">
              {renderCheckboxGroup('berkebutuhanKhususIbu', 'Berkebutuhan Khusus Ibu', kebutuhanKhususOptions)}
            </div>
          </FormSection>
          
          <FormSection title="Data Wali">
            {renderInput('namaWali', 'Nama Wali', 'Boleh dikosongkan')}
            {renderInput('nikWali', 'NIK Wali', '16 digit NIK')}
            {renderInput('tahunLahirWali', 'Tahun Lahir Wali', 'Contoh: 1980')}
            {renderSelect('pendidikanWali', 'Pendidikan Terakhir Wali', pendidikanOptions)}
            {renderSelect('pekerjaanWali', 'Pekerjaan Wali', pekerjaanOptions)}
            {renderSelect('penghasilanWali', 'Penghasilan Bulanan Wali', penghasilanOptions)}
          </FormSection>

          <FormSection title="Kontak">
            {renderInput('nomorTeleponRumah', 'Nomor Telepon Rumah', 'Milik pribadi/orang tua/wali')}
            {renderInput('nomorHp', 'Nomor HP', 'Milik pribadi/orang tua/wali')}
            {renderInput('email', 'Email', 'contoh@email.com', 'email')}
          </FormSection>
        </Accordion>
        
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
