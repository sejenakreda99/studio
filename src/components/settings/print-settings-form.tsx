
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { PrintSettings } from '@/types/settings';
import { updatePrintSettings } from '@/lib/settings-service';

const settingsSchema = z.object({
  schoolLetterheadUrl: z.string().url({ message: 'Harap masukkan URL yang valid.' }).or(z.literal('')).nullable(),
  signaturePlace: z.string().min(1, 'Tempat tanda tangan harus diisi.'),
  committeeHeadTitle: z.string().min(1, 'Jabatan harus diisi.'),
  committeeHeadName: z.string().min(1, 'Nama lengkap harus diisi.'),
  committeeHeadId: z.string().optional().nullable(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface PrintSettingsFormProps {
  initialData: PrintSettings | null;
}

export function PrintSettingsForm({ initialData }: PrintSettingsFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      schoolLetterheadUrl: initialData?.schoolLetterheadUrl || '',
      signaturePlace: initialData?.signaturePlace || 'Naringgul',
      committeeHeadTitle: initialData?.committeeHeadTitle || 'Kepala SMAS PGRI Naringgul,',
      committeeHeadName: initialData?.committeeHeadName || 'H. SUTARDI, S.Pd',
      committeeHeadId: initialData?.committeeHeadId || '',
    },
  });

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
                  <FormLabel>URL Gambar Kop Surat</FormLabel>
                  <FormControl>
                    <Input placeholder="https://contoh.com/gambar-kop.png" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormDescription>
                    Unggah gambar kop surat ke layanan hosting gambar (seperti Imgur) dan tempelkan URL-nya di sini. Biarkan kosong untuk menggunakan teks default.
                  </FormDescription>
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
             <FormField
              control={form.control}
              name="committeeHeadId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NUPTK / NPA / NIP</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nomor identitas pegawai" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormDescription>
                    Nomor identitas unik penandatangan (opsional).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
