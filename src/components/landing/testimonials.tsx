import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Anonymous",
    role: "Entrepreneur",
    content: "Did you create the waitbridge ? because its really good",
    rating: 5,
  },
  {
    name: "Jack",
    role: "Entrepreneur",
    content: "A great interface and very user-friendly. Thank you!",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24 bg-muted/30">
      <div className="flex flex-col items-center space-y-4 text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Loved by Creators
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl">
          See what our users are saying about Waitbridge
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.name} className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                    {testimonial.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

