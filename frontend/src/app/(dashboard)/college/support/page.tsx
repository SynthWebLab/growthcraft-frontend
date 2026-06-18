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
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">Help & Support</h1>
      <p className="text-muted-foreground mt-1 text-sm">Get help with your campus partnership</p>
    </div>

    <div className="grid sm:grid-cols-2 gap-4">
      <Card className="border-border/50">
        <CardContent className="p-5 flex items-center gap-3">
          <Mail className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium text-foreground text-sm">Email Support</p>
            <p className="text-xs text-muted-foreground">campus@growthcraft.in</p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-border/50">
        <CardContent className="p-5 flex items-center gap-3">
          <Phone className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium text-foreground text-sm">Phone Support</p>
            <p className="text-xs text-muted-foreground">+91-9395303089</p>
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="grid lg:grid-cols-2 gap-6 items-start">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HelpCircle className="h-5 w-5" /> FAQs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-sm text-left">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Submit a Query</CardTitle>
        </CardHeader>
        <CardContent>
          <SupportQueryForm />
        </CardContent>
      </Card>
    </div>
  </div>
);

export default CollegeSupport;
