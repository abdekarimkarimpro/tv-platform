import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
     * يتم إرجاع هذه الواجهة بواسطة `useSession` و `getSession` 
     * وتُستقبل كخاصية (prop) في سياق `SessionProvider`
     */
  interface Session {
        user: {
                /** دور المستخدم (مثل: Admin, User) */
          role?: string
        } & DefaultSession["user"]
  }

  /**
     * شكل كائن المستخدم (User Object).
     * نقوم بإضافة الخاصية role هنا ليتعرف عليها TypeScript.
     */
  interface User {
        role?: string
  }
}

declare module "next-auth/jwt" {
  /** يتم إرجاع هذه الواجهة بواسطة `jwt` callback */
  interface JWT {
        role?: string
  }
}
