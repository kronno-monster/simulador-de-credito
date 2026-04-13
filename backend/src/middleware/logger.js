const logger = (req, res, next) => {
  const start = Date.now()
  const { method, path, ip } = req
  const userId = req.user?.id ?? 'anon'

  res.on('finish', () => {
    const ms = Date.now() - start
    console.log(`[${new Date().toISOString()}] ${method} ${path} ${res.statusCode} ${ms}ms user=${userId} ip=${ip}`)
  })

  next()
}

module.exports = logger
