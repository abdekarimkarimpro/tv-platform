// app/api/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma"; // ⬅️ تم التصحيح: استيراد مُسمّى (Named Import)
import { Role } from "@prisma/client";

type Body = {
  email?: string;
  password?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
};

export async function POST(req: Request) {
  try {
    const body: Body = await req.json();

    const { email, password, role, firstName, lastName, phone, city } = body;

    // Basic validation
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Email, password and role are required." },
        { status: 400 }
      );
    }

    // Validate role
    const upperRole = role.toUpperCase();
    if (!["CUSTOMER", "TECHNICIAN", "ADMIN"].includes(upperRole)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists." },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare data for create
    const createData: any = {
      email,
      password: hashedPassword,
      role: upperRole as Role,
    };

    if (upperRole === "CUSTOMER") {
      createData.customer = {
        create: {
          firstName: firstName ?? "",
          lastName: lastName ?? "",
          phone: phone ?? null,
          city: city ?? null,
        },
      };
    } else if (upperRole === "TECHNICIAN") {
      createData.technician = {
        create: {
          firstName: firstName ?? "",
          lastName: lastName ?? "",
          phone: phone ?? null,
          city: city ?? null,
        },
      };
    }

    const newUser = await prisma.user.create({
      data: createData,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        customer: { select: { id: true, firstName: true, lastName: true, phone: true, city: true } },
        technician: { select: { id: true, firstName: true, lastName: true, phone: true, city: true } },
      },
    });

    return NextResponse.json({ message: "User created successfully!", user: newUser }, { status: 201 });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "An error occurred during registration." },
      { status: 500 }
    );
  }
}
