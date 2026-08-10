import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Mail, Phone } from "lucide-react";
import SupportQueryForm from "./SupportQueryForm";

const faqs = [
  { q: "How do I request a new training program?", a: "Go to the Programs page and click 'Request New Program'. Fill in the details and our team will get back to you within 48 hours." },
  { q: "Can we customize the curriculum?", a: "Yes! We work with your faculty to tailor the curriculum to your institution's needs and academic calendar." },
  { q: "How are students evaluated?", a: "Students are evaluated through assignments, projects, quizzes, and a final capstone project." },
  { q: "What is the placement support process?", a: "We organize mock interviews, resume workshops, and connect students directly with our hiring partners." },
];

const CollegeSupport = () => (
  <div className="space-y-6 sm:space-y-8 p-4 sm:p-0">
    <div>
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground font-display">Help & Support</h1>
      <p className="text-muted-foreground mt-1 text-xs sm:text-sm">Get help with your campus partnership</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card className="border-border/60 shadow-sm p-1">
        <CardContent className="p-4 sm:p-5 flex items-center gap-3">
          <Mail className="h-5 w-5 text-magenta shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-foreground text-xs sm:text-sm">Email Support</p>
            <p className="text-xs text-muted-foreground truncate">campus@growthcraft.in</p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-border/60 shadow-sm p-1">
        <CardContent className="p-4 sm:p-5 flex items-center gap-3">
          <Phone className="h-5 w-5 text-magenta shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-foreground text-xs sm:text-sm">Phone Support</p>
            <p className="text-xs text-muted-foreground truncate">+91-9395303089</p>
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <Card className="border-border/60 shadow-sm p-1">
        <CardHeader className="pb-3 px-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2 font-display text-foreground font-bold">
            <HelpCircle className="h-4 sm:h-5 w-4 sm:w-5 text-magenta" /> FAQs
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-border/60">
                <AccordionTrigger className="text-xs sm:text-sm text-left hover:text-magenta transition-colors font-medium py-3">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-3">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm p-1">
        <CardHeader className="pb-3 px-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg font-display text-foreground font-bold">Submit a Query</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <SupportQueryForm />
        </CardContent>
      </Card>
    </div>
  </div>
);

export default CollegeSupport;
