import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
    try {
          const { email, password, role, firstName, lastName, phone, city } = await req.json();

      const existingUser = await prisma.user.findUnique({
              where: { email },
      });

      if (existingUser) {
              return NextResponse.json(
                { error: "User with this email already exists." },
                { status: 400 }
                      );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
              data: {
                        email,
                        password: hashedPassword,
                        role: role as Role,
                        customer: role === 'CUSTOMER' ? {
                                    create: { firstName, lastName, phone, city },
                        } : undefined,
                        technician: role === 'TECHNICIAN' ? {
                                    create: { firstName, lastName, phone, city },
                        } : undefined,
              },
      });

      return NextResponse.json({ message: "User created successfully!" });
    } catch (error) {
          console.error("Registration error:", error);
          return NextResponse.json(
            { error: "An error occurred during registration." },
            { status: 500 }
                );
    }
}
