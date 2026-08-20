import { Section } from "@/components/ui/section";

interface Partner {
  name: string;
  logo?: string;
}

const companies: Partner[] = [
  {
    name: "SynthWeb",
    logo: "/images/partners/synthweb.webp",
  },
  {
    name: "Razorpay",
    logo: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/razorpay-icon.png",
  },
  { name: "Swiggy",
    logo:"https://logos-world.net/wp-content/uploads/2020/11/Swiggy-Symbol.png"
   },
  { name: "Flipkart",
    logo:"https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png"
   },
  { name: "Zomato" ,
    logo:"https://iconlogovector.com/uploads/images/2025/01/lg-677a5f20c5bb4-Zomato.webp"
  },
  { name: "CRED",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/9d/CRED-LOGO2.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"
  },
  { name: "PhonePe",
    logo:"https://download.logo.wine/logo/PhonePe/PhonePe-Logo.wine.png"
  },
  { name: "Groww",
    logo:"https://www.logoshape.com/wp-content/uploads/2025/09/groww-logo_logoshape.png"
   },
  { name: "Meesho",
    logo:"https://images.seeklogo.com/logo-png/50/2/meesho-logo-png_seeklogo-507116.png"
   },
  { name: "Ola",
    logo:"https://1000logos.net/wp-content/uploads/2022/08/Ola-Cabs-Logo.png"
   },
  { name: "Paytm",
    logo:"https://upload.wikimedia.org/wikipedia/commons/4/42/Paytm_logo.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"
   },
  { name: "Freshworks",
    logo:"https://seekvectorlogo.com/wp-content/uploads/2019/09/freshworks-vector-logo.png"
   },
  { name: "Zerodha",
    logo:"https://images.seeklogo.com/logo-png/35/2/zerodha-logo-png_seeklogo-356512.png"
   },
  { name: "Myntra",
    logo:"https://wp.logos-download.com/wp-content/uploads/2016/09/Myntra_logo.png?dl"
   },
  { name: "Nykaa",
    logo:"https://cdn.iconscout.com/icon/free/png-256/free-nykaa-logo-icon-svg-download-png-2822953.png?f=webp"
   },
  { name: "Dream11",
    logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Dream11_logo.svg/3840px-Dream11_logo.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail"
   },
  { name: "ShareChat",
    logo:"https://cdn.iconscout.com/icon/free/png-256/free-share-chat-logo-icon-svg-download-png-1136709.png"
   },
  { name: "Lenskart",
    logo:"https://1000logos.net/wp-content/uploads/2022/10/Lenskart-Logo.png"
   },
  { name: "Byju's",
    logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Byju%27s_logo.svg/3840px-Byju%27s_logo.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail"
   },
  { name: "Unacademy",
    logo:"https://images.seeklogo.com/logo-png/40/2/unacademy-logo-png_seeklogo-400820.png"
   },
  { name: "upGrad",
    logo:"https://compciti.com/wp-content/uploads/2023/07/idE37EUsSR.png"
   },
  { name: "Dunzo",
    logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Dunzo_Logo.svg/3840px-Dunzo_Logo.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail"
   },
  { name: "Urban Company",
    logo:"https://iconlogovector.com/uploads/images/2025/11/lg-69165dd60f7ef-Urban-Company.webp"
   },
  { name: "Rapido",
    logo:"https://1000logos.net/wp-content/uploads/2023/09/Rapido-Logo.png"
   },
  { name: "Practo",
    logo:"https://upload.wikimedia.org/wikipedia/en/6/64/Practo_new_logo.png?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original"
   },
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

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-5 sm:gap-24">
        {companies.map((company) => (
          <div
            key={company.name}
            className="flex items-center justify-center h-14 sm:h-16 rounded-xl bg-card px-3 py-2 "
          >
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="h-25 object-contain   hover:grayscale-0 transition-all"
              />
            ) : (
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                {company.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
};
