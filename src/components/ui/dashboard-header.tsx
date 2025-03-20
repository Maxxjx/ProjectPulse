import { UserButton } from "@/components/user-button"
import { ModeToggle } from "@/components/mode-toggle"
import { NotificationDropdown } from "@/components/NotificationDropdown"
import { DatabaseStatus } from "@/components/ui/database-status"

export function DashboardHeader() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <div className="flex-1">
        <h1 className="text-lg font-semibold">ProjectPulse</h1>
      </div>
      <div className="flex items-center gap-4">
        {/* Add the database status indicator */}
        <DatabaseStatus />
        <NotificationDropdown />
        <ModeToggle />
        <UserButton />
      </div>
    </header>
  )
}

