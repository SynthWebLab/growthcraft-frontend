import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    role: "student" | "college" | "employer" | "mentor";
    phone: string;
    isEmailVerified: boolean;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "student" | "college" | "employer" | "mentor";
      phone: string;
      isEmailVerified: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    phone: string;
    isEmailVerified: boolean;
  }
}
