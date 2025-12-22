import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export function Pricing() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="flex flex-col items-center space-y-4 text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Simple, Transparent Pricing
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl">
          One price. Lifetime access. No subscriptions, no hidden fees.
        </p>
      </div>
      <div className="flex justify-center">
        <Card className="relative flex flex-col border-primary border-2 shadow-lg max-w-md w-full">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
              Lifetime Deal
            </span>
          </div>
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl">Lifetime Access</CardTitle>
            <div className="mt-4">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold">$39</span>
                <span className="text-muted-foreground">one-time</span>
              </div>
            </div>
            <CardDescription className="mt-2 text-base">
              Pay once, own it forever. No recurring fees.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3">
              {[
                "Unlimited waitlists",
                "Unlimited signups",
                "Full customization",
                "Analytics dashboard",
                "Export data",
                "No branding badge",
                "All future updates",
                "Priority support",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <a 
              href={process.env.NEXT_PUBLIC_CREEM_CHECKOUT_URL || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button className="w-full" size="lg">
                Get Lifetime Access
              </Button>
            </a>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}

