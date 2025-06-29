
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useRef } from 'react';
import { Loader2, Upload } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { PrintSettings } from '@/types/settings';
import { updatePrintSettings } from '@/lib/settings-service';

const settingsSchema = z.object({
  schoolLetterheadUrl: z.string().optional().nullable(),
  signaturePlace: z.string().min(1, 'Tempat tanda tangan harus diisi.'),
  committeeHeadTitle: z.string().min(1, 'Jabatan harus diisi.'),
  committeeHeadName: z.string().min(1, 'Nama lengkap harus diisi.'),
  committeeHeadNuptk: z.string().optional().nullable(),
  committeeHeadNip: z.string().optional().nullable(),
  committeeHeadNpa: z.string().optional().nullable(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface PrintSettingsFormProps {
  initialData: PrintSettings | null;
}

export function PrintSettingsForm({ initialData }: PrintSettingsFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      schoolLetterheadUrl: initialData?.schoolLetterheadUrl || '',
      signaturePlace: initialData?.signaturePlace || 'Naringgul',
      committeeHeadTitle: initialData?.committeeHeadTitle || 'Kepala SMAS PGRI Naringgul,',
      committeeHeadName: initialData?.committeeHeadName || 'H. SUTARDI, S.Pd',
      committeeHeadNuptk: initialData?.committeeHeadNuptk || '',
      committeeHeadNip: initialData?.committeeHeadNip || '',
      committeeHeadNpa: initialData?.committeeHeadNpa || '',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // File size check (e.g., 500KB limit) to prevent exceeding Firestore document limits
    const MAX_FILE_SIZE = 500 * 1024; // 500 KB
    if (file.size > MAX_FILE_SIZE) {
      toast({
        variant: 'destructive',
        title: 'Ukuran File Terlalu Besar',
        description: 'Ukuran gambar tidak boleh melebihi 500KB. Harap optimalkan gambar Anda.',
      });
      return;
    }
    
    if (!['image/png', 'image/jpeg', 'image/gif'].includes(file.type)) {
        toast({
            variant: 'destructive',
            title: 'Format File Tidak Didukung',
            description: 'Harap unggah gambar dengan format PNG, JPG, atau GIF.',
        });
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUri = reader.result as string;
      form.setValue('schoolLetterheadUrl', dataUri, { shouldValidate: true });
      toast({
        title: 'Gambar Diproses',
        description: 'Pratinjau gambar telah diperbarui. Jangan lupa klik "Simpan Pengaturan".',
      });
    };
    reader.onerror = () => {
      toast({
        variant: 'destructive',
        title: 'Gagal Membaca File',
        description: 'Terjadi kesalahan saat memproses gambar yang Anda pilih.',
      });
    };
    reader.readAsDataURL(file);
  };


  async function onSubmit(values: SettingsFormValues) {
    setIsLoading(true);
    try {
      await updatePrintSettings(values);
      toast({
        title: 'Pengaturan Disimpan',
        description: 'Pengaturan cetak profil siswa telah berhasil diperbarui.',
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        variant: 'destructive',
        title: 'Gagal Menyimpan',
        description: 'Terjadi kesalahan saat menyimpan pengaturan.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengaturan Cetak Profil Siswa</CardTitle>
        <CardDescription>
          Atur kop surat dan detail penandatangan yang akan muncul pada dokumen PDF profil siswa.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="schoolLetterheadUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gambar Kop Surat</FormLabel>
                  <FormControl>
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/png, image/jpeg, image/gif"
                        onChange={handleFileChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Pilih Gambar Kop Surat
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Unggah gambar kop surat Anda (PNG, JPG, GIF, maks 500KB). Biarkan kosong untuk menggunakan teks default.
                  </FormDescription>
                  {field.value && (
                    <div className="mt-4 rounded-md border p-4">
                      <p className="mb-2 text-sm font-medium">Pratinjau Kop Surat:</p>
                      <Image
                        src={field.value}
                        alt="Pratinjau Kop Surat"
                        width={700}
                        height={150}
                        className="rounded-md border object-contain"
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="signaturePlace"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempat Tanda Tangan</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Naringgul" {...field} />
                  </FormControl>
                  <FormDescription>
                    Lokasi tempat dokumen ditandatangani. Contoh: "Jakarta", "Bandung".
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="committeeHeadTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jabatan Penandatangan</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Kepala Sekolah," {...field} />
                  </FormControl>
                   <FormDescription>
                    Jabatan resmi yang akan muncul di atas nama.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="committeeHeadName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap Penandatangan</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: H. SUTARDI, S.Pd" {...field} />
                  </FormControl>
                   <FormDescription>
                    Nama lengkap beserta gelar (jika ada).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
                <FormLabel>Nomor Identitas Penandatangan</FormLabel>
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="committeeHeadNuptk"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-normal text-muted-foreground">NUPTK</FormLabel>
                        <FormControl>
                          <Input placeholder="Nomor Unik Pendidik" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="committeeHeadNip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-normal text-muted-foreground">NIP</FormLabel>
                        <FormControl>
                          <Input placeholder="Nomor Induk Pegawai" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="committeeHeadNpa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-normal text-muted-foreground">NPA</FormLabel>
                        <FormControl>
                          <Input placeholder="Nomor Pokok Anggota" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormDescription>
                  Isi salah satu nomor identitas. Nomor yang diisi akan ditampilkan pada hasil cetak.
                </FormDescription>
            </div>
            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Pengaturan
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
