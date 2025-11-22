import Link from "next/link"
import { GalleryVerticalEnd } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-2">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-5" />
              </div>
              <span>Acme Inc.</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Building the future of waitlist management, one signup at a time.
            </p>
          </div>
         
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Acme Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

