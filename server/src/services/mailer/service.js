import axios from 'axios'

export default class Service {
  constructor (email, name, apiKey) {
    this.sender = { name, email }

    this.client = axios.create({
      baseURL: 'https://api.sendinblue.com/v3/smtp/email',
      timeout: 5000,
      headers: { 'api-key': apiKey, 'content-type': 'application/json' }
    })
  }

  async create (email) {
    email.sender = this.sender
    try {
      const { status } = await this.client.post('/', email)
      return status
    } catch (e) {
      return e
    }
  }
}
