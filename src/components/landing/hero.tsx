import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 items-center">
        {/* Left side - Content */}
        <div className="flex flex-col space-y-4">
          <div className="lifetime-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 w-fit cursor-pointer">
            <span className="text-sm font-semibold">🔥 Lifetime Deal - $39</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-left">
            Building a Waitlist
            <span className="text-primary"> Shouldn't Be Hard</span>
          </h1>
          <p className="text-lg text-muted-foreground sm:text-xl md:text-2xl text-left max-w-2xl">
            Launch in minutes, not weeks. Build waitlists that match your brand, track growth in real-time, and turn signups into your next big launch. No coding required—just results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/signup">
              <Button size="lg" className="group w-full sm:w-auto">
                Get Started
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
          
          {/* User avatars with count */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex -space-x-2">
              {[
                { name: "Alex", id: "alex" },
                { name: "Sarah", id: "sarah" },
                { name: "Mike", id: "mike" },
                { name: "Emma", id: "emma" },
                { name: "David", id: "david" },
              ].map((user, index) => (
                <Avatar
                  key={user.id}
                  className="border-2 border-background size-10 hover:z-10 transition-transform hover:scale-110"
                  style={{ zIndex: 5 - index }}
                >
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`}
                    alt={user.name}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {user.name[0]}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-foreground">10+ users</p>
              <p className="text-xs text-muted-foreground">Trusted by creators</p>
            </div>
          </div>
        </div>

        {/* Right side - Image placeholder */}
        <div className="relative flex items-center justify-center lg:justify-end min-h-[500px] lg:min-h-[550px]">
          <div className="relative w-full max-w-3xl h-full">
            {/* First image - Analytics at top-left */}
            <div className="absolute top-0 left-0 w-full max-w-sm transform -rotate-3 hover:rotate-0 transition-transform duration-300 z-10">
              <div className="relative rounded-2xl shadow-2xl overflow-hidden border-4 border-background bg-background">
                <Image 
                  src="/analytics.png" 
                  alt="Analytics Preview" 
                  width={500} 
                  height={500}
                  className="object-contain"
                />
              </div>
            </div>
            
            {/* Second image - Editor at top-right, slightly lower */}
            <div className="absolute top-20 right-0 w-full max-w-sm transform rotate-3 hover:rotate-0 transition-transform duration-300 z-20">
              <div className="relative rounded-2xl shadow-2xl overflow-hidden border-4 border-background bg-background">
                <Image 
                  src="/editor.png" 
                  alt="Editor Preview" 
                  width={500} 
                  height={500}
                  className="object-contain"
                />
              </div>
            </div>
            
            {/* Third image - Waitlist at bottom-center */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm transform rotate-2 hover:rotate-0 transition-transform duration-300 z-30">
              <div className="relative rounded-2xl shadow-2xl overflow-hidden border-4 border-background bg-background">
                <Image 
                  src="/waitlist-1.png" 
                  alt="Waitlist Preview" 
                  width={500} 
                  height={500}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

