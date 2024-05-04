import { WireTable } from '@/components/machine/Machine'

export type Rotor = {
  name: string
  position: number
}

export type RotorConfig = {
  rotors: Rotor[]
}

export type PlugConfig = {
  substitutions: Partial<WireTable>
}

export type Config = {
  rotorConfig: RotorConfig
  substitutionConfig: PlugConfig
  message: string
}