"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";

import { signUpTenant } from "@/app/(tenant-auth)/actions";
import {
  tenantRegisterSchema,
  type TenantRegisterInput,
} from "@/lib/validators/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TenantRegisterInput>({
    resolver: zodResolver(tenantRegisterSchema),
    defaultValues: {
      companyName: "",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: TenantRegisterInput) => {
    setFormError(null);
    startTransition(async () => {
      const result = await signUpTenant(values);
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
          className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="companyName">اسم الشركة</Label>
        <Input
          id="companyName"
          placeholder="مثال: شركة الأفق المالية"
          aria-invalid={!!errors.companyName}
          {...register("companyName")}
        />
        {errors.companyName && (
          <p className="text-sm text-destructive">
            {errors.companyName.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">اسمك الكامل</Label>
        <Input
          id="fullName"
          autoComplete="name"
          placeholder="مثال: أحمد خالد"
          aria-invalid={!!errors.fullName}
          {...register("fullName")}
        />
        {errors.fullName && (
          <p className="text-sm text-destructive">{errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">البريد الإلكتروني للعمل</Label>
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

      <div className="space-y-2">
        <Label htmlFor="password">كلمة المرور</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          dir="ltr"
          className="text-start"
          placeholder="••••••••"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          dir="ltr"
          className="text-start"
          placeholder="••••••••"
          aria-invalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "جارٍ إنشاء الحساب…" : "إنشاء الحساب"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        لديك حساب بالفعل؟{" "}
        <Link href="/login" className="text-primary hover:underline">
          تسجيل الدخول
        </Link>
      </p>
    </form>
  );
}
