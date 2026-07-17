import type { Metadata } from "next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ForgotPasswordForm } from "@/components/tenant-auth/forgot-password-form";

export const metadata: Metadata = {
  title: "إعادة تعيين كلمة المرور — MatchFlow",
};

export default function ForgotPasswordPage() {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">إعادة تعيين كلمة المرور</CardTitle>
        <CardDescription>
          أدخل بريدك الإلكتروني وسنرسل إليك رابط إعادة التعيين
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm />
      </CardContent>
    </Card>
  );
}
