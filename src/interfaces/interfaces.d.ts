import React, { Dispatch, SetStateAction } from 'react'
import {
  BidirectionalLogEntry,
  Log,
  LogEntry,
  MachineState,
  Rotor as RotorInterface, WireTable,
} from '@/components/machine/Machine'

interface PanelHeaderProps {
  title: string
  connected: boolean
  onSendClick: any
  toolTipIsActive?: boolean
  toolTipPosition?: 'inside' | 'outside'
  children?: React.ReactNode
}

interface ReflectorProps {
  machineState: MachineState
  reflectorLog: LogEntry | undefined
}

interface RotorProps {
  rotor: RotorInterface
  rotorIndex: number
  rotorLog: BidirectionalLogEntry | null | undefined
  isDragging: boolean
  setIsDragging: Dispatch<SetStateAction<boolean>>
  setMachineState: Dispatch<SetStateAction<MachineState>>
  clearMachine: () => void
}

interface TextLabelProps {
  letter: string
  extraClass?: string
  color?: string
}

interface IOProps {
  plainText: string
  cipherText: string
  textareaRef: React.RefObject<HTMLTextAreaElement>
  onTextAreaChange: React.ChangeEventHandler<HTMLTextAreaElement>
}

interface PlugboardProps {
  machineState: MachineState
  setMachineState: React.Dispatch<React.SetStateAction<MachineState>>
  transformationLog: Log | null
}

interface PlugboardKeyProps {
  char: keyof WireTable
  workingKey: keyof WireTable | null
  isEditing: boolean
  plugboard: Partial<WireTable>
  forwardsKey: keyof WireTable | null
  backwardsKey: keyof WireTable | null
  hoveredKey: keyof WireTable | null
  onPlugboardKeyClick: (e: React.MouseEvent<HTMLSpanElement>) => void
  onPlugboardKeyMouseEnter: (e: React.MouseEvent<HTMLSpanElement>) => void
  onPlugboardKeyMouseLeave: () => void
}
