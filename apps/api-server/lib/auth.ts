import {
  scrypt as _scrypt,
  randomBytes,
  timingSafeEqual,
} from "crypto"
import { promisify } from "util"

const scrypt = promisify(_scrypt)

export const generateToken = (length = 16): string =>
  randomBytes(length).toString("hex")

export const hashPassword = async (
  password: string
): Promise<string> => {
  const salt = randomBytes(16).toString("hex")
  const derivedKey = (await scrypt(
    password,
    salt,
    64
  )) as Buffer

  return `${salt}:${derivedKey.toString("hex")}`
}

export const verifyPassword = async (
  password: string,
  storedHash: string
): Promise<boolean> => {
  const [salt, hash] = storedHash.split(":")
  const derivedKey = (await scrypt(
    password,
    salt,
    64
  )) as Buffer
  const hashBuffer = Buffer.from(hash, "hex")

  return timingSafeEqual(derivedKey, hashBuffer)
}
