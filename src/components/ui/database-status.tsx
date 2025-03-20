"use client"

import { useEffect, useState } from "react"
import { Database, AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function DatabaseStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "mock">("loading")
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check if user is admin (simplified - you would use your auth system)
    const checkAdminStatus = async () => {
      try {
        const response = await fetch("/api/auth/me")
        const data = await response.json()
        setIsAdmin(data.user?.role === "ADMIN")
      } catch (error) {
        console.error("Failed to check admin status:", error)
        setIsAdmin(false)
      }
    }

    // Check database connection status
    const checkDatabaseStatus = async () => {
      try {
        const response = await fetch("/api/system/status")
        const data = await response.json()
        setStatus(data.databaseConnected ? "connected" : "mock")
      } catch (error) {
        console.error("Failed to check database status:", error)
        setStatus("mock")
      }
    }

    checkAdminStatus()
    checkDatabaseStatus()
  }, [])

  // Only show to admins
  if (!isAdmin) return null

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 px-2 py-1 text-xs rounded-md">
            {status === "loading" ? (
              <div className="flex items-center">
                <Database className="w-4 h-4 text-gray-400 animate-pulse" />
                <span className="ml-1 text-gray-400">Checking...</span>
              </div>
            ) : status === "connected" ? (
              <div className="flex items-center">
                <Database className="w-4 h-4 text-green-500" />
                <span className="ml-1 text-green-500">DB Connected</span>
              </div>
            ) : (
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span className="ml-1 text-amber-500">Using Mock Data</span>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {status === "loading"
            ? "Checking database connection..."
            : status === "connected"
              ? "Connected to database. Using real data."
              : "Database connection unavailable. Using mock data as fallback."}

          {status === "mock" && (
            <div className="mt-1 text-xs">
              <p>To connect to a database:</p>
              <ol className="pl-4 list-decimal">
                <li>Set DATABASE_URL in environment variables</li>
                <li>Set USE_PRISMA=true in environment variables</li>
                <li>Restart the application</li>
              </ol>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

