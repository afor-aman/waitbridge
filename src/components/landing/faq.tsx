import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Do I need coding skills to use Waitbridge?",
    answer:
      "Not at all! Waitbridge is designed to be completely no-code. You can create, customize, and launch your waitlist using our intuitive visual editor—no technical knowledge required.",
  },
  {
    question: "How long does it take to set up a waitlist?",
    answer:
      "You can have your waitlist up and running in just a few minutes. Simply sign up, customize your design, and share your link. It's that simple!",
  },
  {
    question: "Can I customize the look and feel of my waitlist?",
    answer:
      "Absolutely! Our editor lets you customize colors, fonts, layout, and more to match your brand perfectly. You have full control over the design.",
  },
  {
    question: "What happens to my data if I cancel?",
    answer:
      "Your data is always yours. You can export all your signup data at any time, even if you decide to cancel your subscription. We believe in data portability.",
  },
  {
    question: "Is there a limit to the number of signups?",
    answer:
      "No! All plans include unlimited signups, so you can scale as much as you need without worrying about limits.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards and process payments securely through our payment provider.",
  },
]

export function FAQ() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="flex flex-col items-center space-y-4 text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Everything you need to know about Waitbridge
        </p>
      </div>
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

