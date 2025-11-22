import { NavBar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">
        <Hero />
      </main>
      <Footer />
    </div>
  )
}