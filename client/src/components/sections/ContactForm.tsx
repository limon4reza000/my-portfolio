'use client';

import { useState, type FormEvent } from 'react';
import { api, ApiError } from '@/lib/api';
import type { ContactPayload } from '@/lib/types';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'sending' | 'sent' | 'error';
type Field = keyof ContactPayload;
type Errors = Partial<Record<Field, string>>;

const EMPTY: ContactPayload = { name: '', email: '', subject: '', message: '', website: '' };

/** Mirrors the server-side Zod rules so users get instant feedback. */
function validate(v: ContactPayload): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your name';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = 'Please enter a valid email';
  if (v.subject.trim().length < 3) e.subject = 'Please add a subject';
  if (v.message.trim().length < 10) e.message = 'Your message should be at least 10 characters';
  return e;
}

const fieldClass =
  'w-full rounded-xl border bg-card px-4 py-3 text-[15px] text-fg placeholder:text-muted/60 outline-none transition focus:border-lime focus:ring-2 focus:ring-lime/20';

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <span id={id} className="mt-1.5 block text-[12px] text-danger">
      {error}
    </span>
  );
}

export function ContactForm() {
  const [values, setValues] = useState<ContactPayload>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const set = (k: Field) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const local = validate(values);
    setErrors(local);
    if (Object.keys(local).length) return;

    setStatus('sending');
    setMessage('');
    try {
      await api.sendContact(values);
      setStatus('sent');
      setValues(EMPTY);
    } catch (err) {
      setStatus('error');
      if (err instanceof ApiError && err.fields) {
        setErrors(Object.fromEntries(Object.entries(err.fields).map(([k, v]) => [k, v?.[0]])) as Errors);
      }
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center text-center" role="status">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lime text-[24px] text-ink">✓</span>
        <p className="mt-6 font-display text-[24px] font-medium">Message sent.</p>
        <p className="mt-2 max-w-[320px] text-[15px] text-muted">Thanks for reaching out! I&apos;ll get back to you as soon as I can.</p>
        <button type="button" onClick={() => setStatus('idle')} className="btn-ghost mt-8">
          Send another
        </button>
      </div>
    );
  }

  const input = (key: Field, label: string, props: Record<string, unknown> = {}) => (
    <label className="block">
      <span className="mb-2 block font-mono text-[12px] text-muted">{label}</span>
      <input
        name={key}
        value={values[key] ?? ''}
        onChange={set(key)}
        aria-invalid={!!errors[key]}
        aria-describedby={errors[key] ? `${key}-error` : undefined}
        className={cn(fieldClass, errors[key] ? 'border-danger' : 'border-line')}
        {...props}
      />
      <FieldError id={`${key}-error`} error={errors[key]} />
    </label>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {input('name', 'Name', { autoComplete: 'name', required: true, placeholder: 'Enter your full name', maxLength: 100 })}
        {input('email', 'Email', { type: 'email', autoComplete: 'email', required: true, placeholder: 'Enter your email address', maxLength: 200 })}
      </div>
      {input('subject', 'Subject', { required: true, placeholder: 'Enter the subject', maxLength: 150 })}

      <label className="block">
        <span className="mb-2 block font-mono text-[12px] text-muted">Message</span>
        <textarea
          name="message"
          rows={6}
          required
          maxLength={5000}
          value={values.message}
          onChange={set('message')}
          placeholder="Write your message here..."
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className={cn(fieldClass, 'resize-y', errors.message ? 'border-danger' : 'border-line')}
        />
        <FieldError id="message-error" error={errors.message} />
      </label>

      {/* Honeypot — hidden from people, tempting for bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        value={values.website}
        onChange={set('website')}
        className="absolute h-0 w-0 scale-0 opacity-0"
      />

      {status === 'error' && message && (
        <p role="alert" className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-[14px] text-danger">
          {message}
        </p>
      )}

      <button type="submit" disabled={status === 'sending'} className="btn-primary mt-2 w-full disabled:cursor-wait disabled:opacity-70">
        {status === 'sending' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
