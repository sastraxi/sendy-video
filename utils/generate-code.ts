import crypto from 'crypto'

const generateCode = (halfSize = 6) =>
  crypto.randomBytes(halfSize).toString('hex')

export default generateCode
