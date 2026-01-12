import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: string
    isPositive: boolean
  }
  iconBgColor?: string
  iconColor?: string
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  iconBgColor = "bg-blue-100",
  iconColor = "text-blue-600",
}: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <p className="mt-2 flex items-center text-sm">
                <span className={cn("font-medium", trend.isPositive ? "text-green-600" : "text-red-600")}>
                  {trend.value}
                </span>
                <span className="ml-1 text-gray-500">vs mês anterior</span>
              </p>
            )}
          </div>
          <div className={cn("rounded-lg p-3", iconBgColor)}>
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
