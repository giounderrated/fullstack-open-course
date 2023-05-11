const app = require('./app') // the actual Express application
const config = require('./utils/Config')
const logger = require('./utils/Logger')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})