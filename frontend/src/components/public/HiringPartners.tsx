import { Section } from "@/components/ui/section";

const companies = [
  "Razorpay",
  "Swiggy",
  "Flipkart",
  "Zomato",
  "CRED",
  "PhonePe",
  "Groww",
  "Meesho",
  "Ola",
  "Paytm",
  "Freshworks",
  "Zerodha",
  "Myntra",
  "Nykaa",
  "Dream11",
  "ShareChat",
  "Lenskart",
  "Byju's",
  "Unacademy",
  "upGrad",
  "Dunzo",
  "Urban Company",
  "Rapido",
  "Practo",
];

export const HiringPartners = () => {
  return (
    <Section variant="white" className="!py-8 sm:!py-12 md:!py-16 lg:!py-20">
      <div className="text-center mb-10 sm:mb-12 md:mb-14 animate-fade-up">
        <p className="text-xs sm:text-sm uppercase tracking-widest text-muted-foreground mb-2 sm:mb-3">
          Hiring partners
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display">
          Where our students get hired.
        </h2>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
        {companies.map((name) => (
          <div
            key={name}
            className="flex items-center justify-center h-12 sm:h-14 rounded-lg bg-muted text-xs sm:text-sm font-medium text-muted-foreground grayscale hover:grayscale-0 transition-all"
          >
            {name}
          </div>
        ))}
      </div>
    </Section>
  );
};
