import type { Metadata } from "next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterForm } from "@/components/tenant-auth/register-form";

export const metadata: Metadata = {
  title: "ابدأ التجربة المجانية — MatchFlow",
};

export default function RegisterPage() {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">أنشئ مساحة عملك</CardTitle>
        <CardDescription>
          ابدأ تجربتك المجانية لمدة 14 يومًا — دون الحاجة إلى بطاقة ائتمان
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </Card>
  );
}
