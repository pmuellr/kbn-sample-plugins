export class Logger {
  private server: any
  private plugin: string

  constructor(server: any, plugin: string) {
    this.server = server
    this.plugin = plugin
  }

  debug(message: string) {
    this.server.log(['debug', this.plugin], message)
  }

  info(message: string) {
    this.server.log(['info', this.plugin], message)
  }

  warn(message: string) {
    this.server.log(['warn', this.plugin], message)
  }

  error(message: string) {
    this.server.log(['error', this.plugin], message)
  }
}