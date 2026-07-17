import type { Metadata } from "next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/tenant-auth/login-form";

export const metadata: Metadata = {
  title: "تسجيل الدخول — MatchFlow",
};

export default function LoginPage() {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">مرحبًا بعودتك</CardTitle>
        <CardDescription>
          سجّل الدخول إلى مساحة عمل MatchFlow الخاصة بك
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
