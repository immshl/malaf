import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      duration={2000}
      position="bottom-right"
      closeButton
      richColors
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white/90 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-gray-900 group-[.toaster]:border-white/30 group-[.toaster]:shadow-2xl group-[.toaster]:shadow-black/10 group-[.toaster]:rounded-2xl dark:group-[.toaster]:bg-gray-900/90 dark:group-[.toaster]:text-gray-100 dark:group-[.toaster]:border-gray-700/50 dark:group-[.toaster]:shadow-black/30",
          description: "group-[.toast]:text-gray-600 dark:group-[.toast]:text-gray-400 group-[.toast]:text-base group-[.toast]:opacity-90",
          actionButton:
            "group-[.toast]:bg-primary/90 group-[.toast]:text-white group-[.toast]:backdrop-blur-sm group-[.toast]:rounded-xl group-[.toast]:px-4 group-[.toast]:py-2",
          cancelButton:
            "group-[.toast]:bg-gray-100/80 group-[.toast]:text-gray-700 dark:group-[.toast]:bg-gray-800/80 dark:group-[.toast]:text-gray-300 group-[.toast]:backdrop-blur-sm group-[.toast]:rounded-xl",
          closeButton: "group-[.toast]:bg-white/10 group-[.toast]:border-white/20 group-[.toast]:text-gray-500 dark:group-[.toast]:text-gray-400 group-[.toast]:backdrop-blur-sm",
          title: "group-[.toast]:text-lg group-[.toast]:font-semibold group-[.toast]:leading-none group-[.toast]:tracking-tight",
          success: "group-[.toast]:bg-green-500/95 group-[.toast]:text-white group-[.toast]:border-green-300/40",
          error: "group-[.toast]:bg-red-500/95 group-[.toast]:text-white group-[.toast]:border-red-300/40",
          warning: "group-[.toast]:bg-amber-500/95 group-[.toast]:text-white group-[.toast]:border-amber-300/40",
          info: "group-[.toast]:bg-blue-500/95 group-[.toast]:text-white group-[.toast]:border-blue-300/40",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
