
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
import { uploadFile } from '@/lib/storage-service';

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
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const downloadURL = await uploadFile(file, 'letterheads');
      form.setValue('schoolLetterheadUrl', downloadURL, { shouldValidate: true });
      toast({
        title: 'Upload Berhasil',
        description: 'Gambar kop surat telah berhasil diunggah.',
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Gagal',
        description: 'Terjadi kesalahan saat mengunggah gambar. Pastikan Anda memiliki izin di Firebase Storage.',
      });
    } finally {
      setIsUploading(false);
    }
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
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="mr-2 h-4 w-4" />
                        )}
                        {isUploading ? 'Mengunggah...' : 'Pilih Gambar Kop Surat'}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Unggah gambar kop surat Anda (format PNG, JPG). Biarkan kosong untuk menggunakan teks default.
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
                <Button type="submit" disabled={isLoading || isUploading}>
                {(isLoading || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Pengaturan
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
