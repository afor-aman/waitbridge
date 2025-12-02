import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for trying out Waitbridge",
    features: [
      "1 waitlist",
      "Unlimited signups",
      "Customization",
      "Analytics",
      "Export data",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Lifetime Deal",
    price: "$39",
    description: "One-time payment, lifetime access",
    features: [
      "Unlimited waitlists",
      "Unlimited signups",
      "Customization",
      "Analytics",
      "Export data",
      "Removal of brand badge",
      "Access to all upcoming features",
    ],
    cta: "Get Lifetime Access",
    popular: true,
  },
]

export function Pricing() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="flex flex-col items-center space-y-4 text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Simple, Transparent Pricing
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Choose the plan that's right for you. Start free, upgrade when you're ready.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative flex flex-col ${
              plan.popular
                ? "border-primary border-2 shadow-lg scale-105 md:scale-110"
                : "border-2"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="mt-4">
                <div className="flex items-baseline justify-center gap-3">
                  <span className="text-4xl font-bold">{plan.price}</span>
                </div>
              </div>
              <CardDescription className="mt-2 text-base">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/signup" className="w-full">
                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className="w-full"
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}

