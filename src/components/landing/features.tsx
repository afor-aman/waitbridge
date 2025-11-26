import { Zap, Palette, BarChart3, Rocket, Download, Globe } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Zap,
    title: "Launch in Minutes",
    description: "Get your waitlist up and running in minutes, not weeks. No coding required—just customize and launch.",
  },
  {
    icon: Palette,
    title: "Fully Customizable",
    description: "Match your brand perfectly with our intuitive editor. Customize colors, fonts, and layout to your heart's content.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Track your growth with comprehensive analytics. See signups, conversion rates, and engagement metrics in real-time.",
  },
  {
    icon: Rocket,
    title: "Built for Growth",
    description: "Scale effortlessly as your waitlist grows. Handle thousands of signups without breaking a sweat.",
  },
  {
    icon: Download,
    title: "Export to CSV",
    description: "Export all your signup data to CSV format anytime. Keep your data portable and accessible for your own analysis.",
  },
  {
    icon: Globe,
    title: "Mobile Responsive",
    description: "Your waitlist looks perfect on every device. Mobile-first design ensures a great experience for all users.",
  },
]

export function Features() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="flex flex-col items-center space-y-4 text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Everything You Need to Launch
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Powerful features that make building and managing your waitlist effortless
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Card key={feature.title} className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

