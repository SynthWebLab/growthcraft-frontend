import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Mail, Phone } from "lucide-react";
import SupportQueryForm from "./SupportQueryForm";

const faqs = [
  { q: "How do I post a new job?", a: "Go to the Job Postings page and click 'Post New Job'. Fill in the role details and requirements." },
  { q: "How are candidates scored?", a: "Candidates are scored based on course completion, project quality, quiz scores, and mentor evaluations." },
  { q: "Can I conduct interviews through the platform?", a: "Currently interviews are scheduled through the platform but conducted on your preferred tool (Zoom, Google Meet, etc.)." },
  { q: "What are the hiring fees?", a: "Our hiring fees are structured based on the role type. Contact our team for detailed pricing." },
];

const EmployerSupport = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">Help & Support</h1>
      <p className="text-muted-foreground mt-1 text-sm">Get help with hiring and platform usage</p>
    </div>

    <div className="grid sm:grid-cols-2 gap-4">
      <Card className="border-border/50">
        <CardContent className="p-5 flex items-center gap-3">
          <Mail className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium text-foreground text-sm">Email</p>
            <p className="text-xs text-muted-foreground">employers@growthcraft.in</p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-border/50">
        <CardContent className="p-5 flex items-center gap-3">
          <Phone className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium text-foreground text-sm">Phone</p>
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

export default EmployerSupport;
