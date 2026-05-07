import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Activity, UserPlus, Mail, Lock, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';

const schema = z
  .object({
    name: z.string().min(2, 'Name is too short'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm: z.string(),
    role: z.enum(['Doctor', 'Nurse']),
  })
  .refine((v) => v.password === v.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  });
type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', confirm: '', role: 'Doctor' },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      });
      navigate('/', { replace: true });
    } catch {
      // toast handled in context
    } finally {
      setSubmitting(false);
    }
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
          <h1 className="text-xl font-semibold text-themeBlack dark:text-themeWhite">Create account</h1>
          <p className="text-sm text-themeBlack/60 dark:text-themeWhite/60 mt-1">
            Register to start managing patients.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <Input
              label="Full name"
              leftIcon={<UserIcon className="w-4 h-4" />}
              autoComplete="name"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Email"
              type="email"
              leftIcon={<Mail className="w-4 h-4" />}
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              leftIcon={<Lock className="w-4 h-4" />}
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label="Confirm password"
              type="password"
              leftIcon={<Lock className="w-4 h-4" />}
              autoComplete="new-password"
              error={errors.confirm?.message}
              {...register('confirm')}
            />
            <Select
              label="Role"
              options={[
                { value: 'Doctor', label: 'Doctor' },
                { value: 'Nurse', label: 'Nurse' },
              ]}
              error={errors.role?.message}
              {...register('role')}
            />
            <Button
              type="submit"
              fullWidth
              loading={submitting}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Create account
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-themeBlack/60 dark:text-themeWhite/60">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
