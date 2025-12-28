import app from "./app"
import { env } from "./config/env"

const PORT = env.port 

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📝 Environment: ${env.nodeEnv}`)
  console.log(`🔗 API available at: http://localhost:${PORT}/api`)
})
