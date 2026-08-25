import Link from "next/link";
import Image from "next/image";
import logoMain from "@/assets/logo-main.png";
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram, Youtube } from "lucide-react";

const footerLinks = {
  platform: [
    { name: "Courses", path: "/courses" },
    { name: "Mentorship", path: "/for-mentors" },
    { name: "Career Services", path: "/for-students" },
  ],
  partners: [
    { name: "For Students", path: "/for-students" },
    { name: "For Colleges", path: "/for-colleges" },
    { name: "For Mentors", path: "/for-mentors" },
    { name: "For Employers", path: "/for-employers" },
  ],
  portals: [
    { name: "Student Dashboard", path: "/login/student" },
    { name: "College Dashboard", path: "/login/college" },
    { name: "Mentor Dashboard", path: "/login/mentor" },
    { name: "Employer Dashboard", path: "/login/employer" },
  ],
  company: [
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
  ],
};

export const Footer = () => {
  return (
    // <footer className="bg-foreground text-background">
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-8">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-block mb-4 md:mb-6">
              <Image
                src={logoMain}
                alt="GrowthCraft"
                className="h-8 md:h-10 w-auto brightness-0 invert"
                height={40}
                width={120}
                style={{ width: "auto" }}
              />
            </Link>
            <p className="text-background/70 mb-4 md:mb-6 max-w-sm text-sm md:text-base">
              GrowthCraft is your all-in-one platform to learn tech, master
              industry skills, and land your dream job.
            </p>
            <div className="space-y-2 md:space-y-3">
              <a
                href="mailto:info@growthcraft.in"
                className="flex items-center gap-2 md:gap-3 text-background/70 hover:text-background transition-colors text-sm md:text-base"
              >
                <Mail className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                <span className="truncate">info@growthcraft.in</span>
              </a>
              <a
                href="tel:+919395303089"
                className="flex items-center gap-2 md:gap-3 text-background/70 hover:text-background transition-colors text-sm md:text-base"
              >
                <Phone className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                +91-9395303089
              </a>
              <div className="flex items-start gap-2 md:gap-3 text-background/70 text-sm md:text-base">
                <MapPin className="h-4 w-4 md:h-5 md:w-5 mt-0.5 flex-shrink-0" />
                <span className="text-xs md:text-sm">Guwahati, Assam, India</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-bold text-base md:text-lg mb-3 md:mb-4 text-background">
              Platform
            </h4>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-background/70 hover:text-background transition-colors text-sm md:text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partners Links */}
          <div>
            <h4 className="font-bold text-base md:text-lg mb-3 md:mb-4 text-background">
              Partners
            </h4>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.partners.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-background/70 hover:text-background transition-colors text-sm md:text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="font-bold text-base md:text-lg mb-3 md:mb-4 text-background">
              Portals
            </h4>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.portals.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-background/70 hover:text-background transition-colors text-sm md:text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold text-base md:text-lg mb-3 md:mb-4 text-background">
              Company
            </h4>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-background/70 hover:text-background transition-colors text-sm md:text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-background/20 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-3 md:gap-4">
            <a
              href="#"
              className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
            >
              <Linkedin className="h-4 w-4 md:h-5 md:w-5" />
            </a>
            <a
              href="#"
              className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
            >
              <Twitter className="h-4 w-4 md:h-5 md:w-5" />
            </a>
            <a
              href="#"
              className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
            >
              <Instagram className="h-4 w-4 md:h-5 md:w-5" />
            </a>
            <a
              href="#"
              className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
            >
              <Youtube className="h-4 w-4 md:h-5 md:w-5" />
            </a>
          </div>
          <p className="text-background/50 text-xs md:text-sm text-center">
            © {new Date().getFullYear()} GrowthCraft. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
