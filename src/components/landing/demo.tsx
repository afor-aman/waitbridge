export function Demo() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="flex flex-col items-center space-y-4 text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          See It In Action
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Watch how easy it is to create and customize your waitlist
        </p>
      </div>
      <div className="flex justify-center">
        <div className="w-full max-w-7xl aspect-video overflow-hidden">
          <iframe
            src="https://player.vimeo.com/video/1140883929?title=0&byline=0&portrait=0"
            className="w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Waitbridge Demo Video"
          ></iframe>
        </div>
      </div>
    </section>
  )
}

