import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET() {
  let databaseConnected = false

  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    databaseConnected = true
  } catch (error) {
    console.error("Database connection check failed:", error)
    databaseConnected = false
  }

  return NextResponse.json({
    status: "ok",
    databaseConnected,
    usingMockData: !databaseConnected,
    environment: process.env.NODE_ENV,
    usePrisma: process.env.USE_PRISMA === "true",
    timestamp: new Date().toISOString(),
  })
}

