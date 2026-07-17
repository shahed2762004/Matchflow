"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import { requestPasswordReset } from "@/app/(tenant-auth)/actions";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validators/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: ForgotPasswordInput) => {
    setFormError(null);
    setSuccessMessage(null);
    startTransition(async () => {
      const result = await requestPasswordReset(values);
      if ("error" in result) {
        setFormError(result.error);
      } else {
        setSuccessMessage(result.success);
      }
    });
  };

  if (successMessage) {
    return (
      <div className="space-y-4">
        <div
          role="status"
          className="flex items-start gap-2 rounded-md border border-success/30 bg-success/10 p-3 text-sm text-success"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/login">العودة إلى تسجيل الدخول</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {formError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">البريد الإلكتروني</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          dir="ltr"
          className="text-start"
          placeholder="you@company.com"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "جارٍ الإرسال…" : "إرسال رابط إعادة التعيين"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        هل تذكّرت كلمة المرور؟{" "}
        <Link href="/login" className="text-primary hover:underline">
          تسجيل الدخول
        </Link>
      </p>
    </form>
  );
}
