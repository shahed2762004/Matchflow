"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";

import { signInAdmin } from "@/app/admin-portal/login/actions";
import { adminLoginSchema, type AdminLoginInput } from "@/lib/validators/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLoginForm() {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: AdminLoginInput) => {
    setFormError(null);
    startTransition(async () => {
      const result = await signInAdmin(values);
      if (result && "error" in result) {
        setFormError(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {formError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-stone-300">
          البريد الإلكتروني للمسؤول
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          dir="ltr"
          placeholder="admin@matchflow.io"
          aria-invalid={!!errors.email}
          className="border-stone-700 bg-stone-900/60 text-start text-stone-100 placeholder:text-stone-500 focus-visible:ring-amber-600"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-stone-300">
          كلمة المرور
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          dir="ltr"
          placeholder="••••••••"
          aria-invalid={!!errors.password}
          className="border-stone-700 bg-stone-900/60 text-start text-stone-100 placeholder:text-stone-500 focus-visible:ring-amber-600"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-red-400">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-amber-600 text-stone-950 hover:bg-amber-500"
      >
        {isPending ? "جارٍ المصادقة…" : "الدخول إلى بوابة الإدارة"}
      </Button>
    </form>
  );
}
