"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";

import { signInTenant } from "@/app/(tenant-auth)/actions";
import { tenantLoginSchema, type TenantLoginInput } from "@/lib/validators/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TenantLoginInput>({
    resolver: zodResolver(tenantLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: TenantLoginInput) => {
    setFormError(null);
    startTransition(async () => {
      const result = await signInTenant(values);
      // عند النجاح يقوم الإجراء بإعادة التوجيه؛ لا نصل هنا إلا عند الفشل.
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

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">كلمة المرور</Label>
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            هل نسيت كلمة المرور؟
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
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

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "جارٍ تسجيل الدخول…" : "تسجيل الدخول"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        ليس لديك حساب؟{" "}
        <Link href="/register" className="text-primary hover:underline">
          ابدأ التجربة المجانية
        </Link>
      </p>
    </form>
  );
}
