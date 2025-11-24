export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="font-semibold">Waitbridge</p>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Waitbridge All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

