import { NextResponse } from "next/server";
import prisma from "../../../../lib/db";
import { getAuthenticatedUser } from "@/lib/utils/auth";
