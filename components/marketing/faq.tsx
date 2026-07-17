"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "كيف تحافظ MatchFlow على فصل بيانات كل شركة؟",
    answer:
      "كل جدول محميّ بأمان مستوى الصفوف (RLS) في PostgreSQL. تُقيَّد استعلامات كل مستأجر تلقائيًا بمعرّف المستأجر الخاص به على مستوى قاعدة البيانات، ما يجعل من المستحيل ماديًا أن تطّلع شركة على معاملات شركة أخرى — حتى عبر الواجهة البرمجية.",
  },
  {
    question: "ما المصادر المالية التي يمكنني ربطها؟",
    answer:
      "بنك فلسطين وجوال بي وباي بال مدعومة جاهزيًا، إلى جانب تكاملات أنظمة ERP عبر واجهات API ورفع ملفات CSV/Excel لسجلاتك الداخلية. تصل كل المصادر إلى دفتر أستاذ موحّد.",
  },
  {
    question: "كيف يطابق محرّك المطابقة المعاملات فعليًا؟",
    answer:
      "يقارن المحرّك المعاملات الخارجية مع سجلاتك الداخلية اعتمادًا على المبلغ والتاريخ والمرجع، ويمنح كل اقتران درجة ثقة. تُطبَّق التطابقات عالية الثقة آليًا، بينما يُوسَم كل ما هو غامض لمراجعة يدوية سريعة.",
  },
  {
    question: "ماذا يحدث عند وجود فرق مالي؟",
    answer:
      "تُوسَم الفروقات — المبالغ غير المتطابقة أو القيود المفقودة أو المكرّرة — في الوقت الفعلي وتظهر على لوحة معلوماتك. يمكنك التحقيق فيها وإضافة ملاحظات وحلّها يدويًا، مع تسجيل كل إجراء في سجل التدقيق.",
  },
  {
    question: "هل هناك تجربة مجانية؟",
    answer:
      "نعم. تبدأ كل باقة بتجربة مجانية لمدة 14 يومًا دون الحاجة إلى بطاقة ائتمان. يمكنك استكشاف المنصة بالكامل والإلغاء في أي وقت قبل انتهاء التجربة.",
  },
  {
    question: "هل يمكنني دعوة فريقي المالي بالكامل؟",
    answer:
      "بالتأكيد. يمكن لكل مستأجر إضافة أعضاء فريق بصلاحيات قائمة على الأدوار — مدير المستأجر، أو المدير، أو الموظف، أو المُطّلِع للقراءة فقط — بحيث يرى كل شخص ما يحتاجه فقط لا غير.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="border-t border-border/60 bg-secondary/40 py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            الأسئلة الشائعة
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            كل ما تحتاج معرفته عن MatchFlow. لم تجد إجابة؟ تواصل مع فريقنا.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
