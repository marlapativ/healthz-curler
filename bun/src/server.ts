const server = Bun.serve({
  port: process.env.PORT || 4201,
  fetch(req) {
    console.log(req.url)
    return new Response('Bun!')
  }
})
