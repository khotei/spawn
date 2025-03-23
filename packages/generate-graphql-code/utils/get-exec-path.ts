import process from "node:process"

export const getExecPath = () => {
  const { INIT_CWD: execPath } = process.env

  if (!execPath) {
    throw new Error("Could not find module path")
  }

  return execPath
}
