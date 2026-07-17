import { z } from "zod";

/** قاعدة كلمة المرور المشتركة: 8 أحرف على الأقل، تتضمّن حرفًا ورقمًا. */
const passwordSchema = z
  .string()
  .min(8, "يجب أن تتكوّن كلمة المرور من 8 أحرف على الأقل")
  .regex(/[A-Za-z]/, "يجب أن تحتوي كلمة المرور على حرف")
  .regex(/[0-9]/, "يجب أن تحتوي كلمة المرور على رقم");

export const tenantLoginSchema = z.object({
  email: z.string().email("أدخل بريدًا إلكترونيًا صالحًا"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});
export type TenantLoginInput = z.infer<typeof tenantLoginSchema>;

export const tenantRegisterSchema = z
  .object({
    companyName: z
      .string()
      .min(2, "يجب أن يتكوّن اسم الشركة من حرفين على الأقل")
      .max(80, "اسم الشركة طويل جدًا"),
    fullName: z
      .string()
      .min(2, "يجب أن يتكوّن الاسم الكامل من حرفين على الأقل")
      .max(80, "الاسم الكامل طويل جدًا"),
    email: z.string().email("أدخل بريدًا إلكترونيًا صالحًا"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });
export type TenantRegisterInput = z.infer<typeof tenantRegisterSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("أدخل بريدًا إلكترونيًا صالحًا"),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const adminLoginSchema = z.object({
  email: z.string().email("أدخل بريدًا إلكترونيًا صالحًا"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
