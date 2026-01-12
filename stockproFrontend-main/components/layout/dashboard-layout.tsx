"use client"

import type React from "react"
import { Sidebar } from "./sidebar"
import { PrivateRoute } from "@/components/auth/private-route"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <PrivateRoute>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 lg:ml-64">
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </PrivateRoute>
  )
}
