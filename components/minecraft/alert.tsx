import { cn } from "@/lib/utils"
import { AlertTriangle, CheckCircle, Info } from "lucide-react"

interface MCAlertProps {
  type?: "error" | "success" | "info"
  message: string
  className?: string
}

export const MCAlert = ({ type = "info", message, className }: MCAlertProps) => {
  const styles = {
    error: "bg-red-900/80 border-red-500 text-red-200",
    success: "bg-green-900/80 border-green-500 text-green-200",
    info: "bg-blue-900/80 border-blue-500 text-blue-200",
  }

  const icons = {
    error: <AlertTriangle className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 border-4 font-minecraft text-xs leading-relaxed shadow-lg backdrop-blur-sm",
        styles[type],
        className,
      )}
    >
      {icons[type]}
      <span>{message}</span>
    </div>
  )
}
