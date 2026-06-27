import { useState } from 'react';
import { z } from 'zod';
import { useAuth } from '../state/auth';
import { useToast } from '../state/toast';
import { Link } from 'react-router-dom';
import type { Role } from '../types';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'MANAGER', 'ACCOUNTANT'], { message: 'Invalid role selected' }),
});

export function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('ACCOUNTANT');
  const [submitting, setSubmitting] = useState(false);
  const { login, register } = useAuth();
  const { push } = useToast();

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (isRegister) {
        const parsed = registerSchema.safeParse({ fullName, email, password, role });
        if (!parsed.success) {
          push({ title: 'Validation Error', message: parsed.error.issues[0]?.message, tone: 'error' });
          return;
        }
        await register(parsed.data.fullName, parsed.data.email, parsed.data.password, parsed.data.role);
        push({ title: 'Registration Successful', message: 'Welcome to FinanceFlow AI! Please log in.', tone: 'success' });
        setIsRegister(false); // Switch to login form after successful registration
      } else {
        const parsed = loginSchema.safeParse({ email, password });
        if (!parsed.success) {
          push({ title: 'Validation Error', message: parsed.error.issues[0]?.message, tone: 'error' });
          return;
        }
        await login(email, password);
        push({ title: 'Signed in', message: 'Welcome to FinanceFlow AI', tone: 'success' });
      }
    } catch (error: any) {
      push({ title: isRegister ? 'Registration Failed' : 'Login Failed', message: error.message || 'An unexpected error occurred', tone: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-4 py-8">
      <div className="glass-card grid w-full max-w-6xl overflow-hidden rounded-[2rem] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative overflow-hidden p-8 sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.16),transparent_30%)]" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">FinanceFlow AI</p>
            <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">Manage expenses, budgets, approvals, and AI insights in one system.</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted">Built for accountants, managers, and admins with live dashboards, OCR-ready receipts, role-based access, and AI support.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ['Role-based', 'Secure access control'],
                ['OCR ready', 'Receipt extraction flow'],
                ['AI assistant', 'Gemini-connected chat'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl border border-line bg-panel p-4">
                  <p className="font-medium">{title}</p>
                  <p className="mt-1 text-sm text-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-line bg-panel p-8 sm:p-10 lg:border-l lg:border-t-0">
          <div className="max-w-md">
            <p className="text-sm uppercase tracking-[0.25em] text-muted">{isRegister ? 'Register' : 'Sign in'}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">{isRegister ? 'Create an account' : 'Welcome back'}</h2>
            {!isRegister && <p className="mt-2 text-sm text-muted">Use the seeded demo accounts to explore the app.</p>}
          </div>
          <form className="mt-8 space-y-5" onSubmit={submit}>
            {isRegister && (
              <div>
                <label className="label-text" htmlFor="fullName">Full Name</label>
                <input id="fullName" className="input-field" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" />
              </div>
            )}
            <div>
              <label className="label-text" htmlFor="email">Email</label>
              <input id="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@financeflow.com" />
            </div>
            <div>
              <label className="label-text" htmlFor="password">Password</label>
              <input id="password" type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            {isRegister && (
              <div>
                <label className="label-text" htmlFor="role">Role</label>
 <select
  id="role"
  className="input-field"
  value={role}
  onChange={(e) => setRole(e.target.value as Role)}
>
                  <option value="ACCOUNTANT">Accountant</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            )}
            <button className="primary-button w-full py-3" disabled={submitting} type="submit">
              {submitting ? (isRegister ? 'Registering...' : 'Signing in...') : (isRegister ? 'Register' : 'Sign in')}
            </button>
          </form>
          <div className="mt-4 text-center text-sm">
            {isRegister ? (
              <p>Already have an account? <Link to="#" onClick={() => setIsRegister(false)} className="text-primary hover:underline">Sign in</Link></p>
            ) : (
              <p>Don't have an account? <Link to="#" onClick={() => setIsRegister(true)} className="text-primary hover:underline">Register</Link></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
