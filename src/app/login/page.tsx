import { LoginForm } from '@/components/auth/login-form';
import { School } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-20 items-center border-b bg-card px-4 shadow-sm md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <School className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">
            SDS SMAS PGRI NARINGGUL
          </h1>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6">
        <LoginForm />
      </main>
      <footer className="flex h-16 items-center justify-center border-t bg-card px-4 text-center">
        <p className="text-sm text-muted-foreground">
          2025 &copy; Hak Cipta Dilindungi. Dibuat oleh SMAS PGRI Naringgul.
        </p>
      </footer>
    </div>
  );
}
