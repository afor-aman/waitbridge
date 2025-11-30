import { Loader } from "lucide-react"
import Link from "next/link"
import { LoginForm } from "@/components/partials/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="grid h-screen lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Loader className="size-4" />
            </div>
            Waitbridge
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src="/building.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          width={1200}
          height={800}
        />
      <div className="absolute inset-0 bg-black/60"></div>
      </div>
    </div>
  )
}
