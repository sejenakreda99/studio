import type { StudentFormValues } from '@/lib/schemas/student-schema';

// Type for student data fetched from Firestore, where dates are strings.
export type Student = Omit<StudentFormValues, 'tanggalLahir' | 'tanggalRegistrasi'> & {
  id: string;
  tanggalLahir: string | null;
  tanggalRegistrasi: string | null;
};
