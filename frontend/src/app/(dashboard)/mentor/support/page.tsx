import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Mail, Phone } from "lucide-react";
import SupportQueryForm from "./SupportQueryForm";

const faqs = [
  { q: "How do I schedule sessions with my students?", a: "Go to the Sessions page and click 'Add Session'. You can set up 1:1 or group sessions." },
  { q: "How do I track student progress?", a: "The Students page shows each student's progress. You can also add notes and feedback." },
  { q: "How do I get paid?", a: "Payments are processed monthly based on sessions conducted. Check your payout details on the Earnings page." },
  { q: "Can I mentor in multiple domains?", a: "Yes! Update your expertise areas in your Profile to be matched with relevant students." },
];

const MentorSupport = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">Help & Support</h1>
      <p className="text-muted-foreground mt-1 text-sm">Get help with your mentoring activities</p>
    </div>

    <div className="grid sm:grid-cols-2 gap-4">
      <Card className="border-border/50">
        <CardContent className="p-5 flex items-center gap-3">
          <Mail className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium text-foreground text-sm">Email</p>
            <p className="text-xs text-muted-foreground">mentors@growthcraft.in</p>
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

export default MentorSupport;
