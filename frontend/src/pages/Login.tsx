import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Activity, LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const schema = z.object({
 email: z.string().email('Enter a valid email'),
 password: z.string().min(1, 'Password is required'),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
 const { login, isAuthenticated } = useAuth();
 const navigate = useNavigate();
 const location = useLocation();
 const [submitting, setSubmitting] = useState(false);

 const {
 register,
 handleSubmit,
 formState: { errors },
 setValue,
 } = useForm<FormValues>({
 resolver: zodResolver(schema),
 defaultValues: { email: '', password: '' },
 });

 if (isAuthenticated) {
 navigate('/', { replace: true });
 }

 const from = (location.state as { from?: string })?.from || '/';

 const onSubmit = async (values: FormValues) => {
 setSubmitting(true);
 try {
 await login(values);
 navigate(from, { replace: true });
 } catch {
 // toast handled in context
 } finally {
 setSubmitting(false);
 }
 };

 const fillDemo = (email: string) => {
 setValue('email', email);
 setValue('password', 'Password123!');
 };

 return (
 <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4">
 <div className="w-full max-w-md">
 <div className="flex items-center justify-center gap-2 mb-6">
 <div className="p-2 bg-accentBlue text-white">
 <Activity className="w-6 h-6" />
 </div>
 <span className="text-2xl font-bold text-themeBlack dark:text-themeWhite">MedDash</span>
 </div>

 <div className="bg-themeWhite dark:bg-themeBlack border-2 border-themeBlack dark:border-themeWhite shadow-sm p-8">
 <h1 className="text-xl font-semibold text-themeBlack dark:text-themeWhite">
 Welcome back
 </h1>
 <p className="text-sm text-gray-500 dark:text-themeWhite/60 mt-1">
 Sign in to your Medical Dashboard account.
 </p>

 <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
 <Input
 label="Email"
 type="email"
 autoComplete="email"
 leftIcon={<Mail className="w-4 h-4" />}
 placeholder="doctor@meddash.local"
 error={errors.email?.message}
 {...register('email')}
 />
 <Input
 label="Password"
 type="password"
 autoComplete="current-password"
 leftIcon={<Lock className="w-4 h-4" />}
 placeholder="••••••••"
 error={errors.password?.message}
 {...register('password')}
 />
 <Button type="submit" fullWidth loading={submitting} leftIcon={<LogIn className="w-4 h-4" />}>
 Sign in
 </Button>
 </form>

 <div className="mt-5 p-3 bg-blue-50 dark:bg-blue-900/20 text-xs text-blue-700 dark:text-blue-300">
 <p className="font-semibold mb-1">Demo accounts</p>
 <div className="space-y-1">
 {[
 { email: 'doctor@meddash.local', role: 'Doctor' },
 { email: 'nurse@meddash.local', role: 'Nurse' },
 { email: 'admin@meddash.local', role: 'Admin' },
 ].map((a) => (
 <button
 key={a.email}
 type="button"
 onClick={() => fillDemo(a.email)}
 className="w-full text-left hover:underline"
 >
 {a.role}: <span className="font-mono">{a.email}</span> · Password123!
 </button>
 ))}
 </div>
 </div>

 <p className="mt-6 text-sm text-center text-gray-500 dark:text-themeWhite/60">
 Don't have an account?{' '}
 <Link to="/register" className="text-blue-600 hover:underline">
 Create one
 </Link>
 </p>
 </div>
 </div>
 </div>
 );
}
