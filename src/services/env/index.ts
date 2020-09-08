import { Environment } from './Environment'
import { config } from 'dotenv-flow'

config()

const env = new Environment()
env.create()
env.check()
env.print()

export { env }
export * from './PackageJson.type'
