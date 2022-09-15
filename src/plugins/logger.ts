import consola from 'consola'

export default {
  async serverWillStart() {
    consola.warn({ badge: true, message: 'Server starting...' })
  }
}