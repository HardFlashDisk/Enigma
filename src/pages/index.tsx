import { Plugboard } from '@/components/dom/Plugboard'
import { IO } from '@/components/dom/IO'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { initialReflector, initialRotors } from '@/_globals'
import { RotorsScene } from '@/components/canvas/RotorScene'
import { PanelHeader } from '@/components/dom/PanelHeader'
import { Log, Machine, MachineState } from '@/components/machine/Machine'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import type { Config, PlugConfig, RotorConfig } from '@/types/types'

export default function Page() {
  const HOST = process.env.NEXT_PUBLIC_WS_HOST;
  const PORT = process.env.NEXT_PUBLIC_WS_PORT;
  const SOCKET_URL = `ws://${HOST}:${PORT}`

  const [machineState, setMachineState] = useState<MachineState>({
    plugboard: {},
    rotors: initialRotors,
    reflector: initialReflector,
  })
  const [transformationLog, setTransformationLog] = useState<Log | null>(null)
  const [plainText, setPlainText] = useState<string>('')
  const [cipherText, setCipherText] = useState<string>('')

  const { sendMessage, lastMessage, readyState } = useWebSocket(SOCKET_URL);

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const clearMachine = () => {
    setPlainText('')
    setCipherText('')
    setTransformationLog(null)
  }

  const onTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const machine = new Machine({
      plugboard: machineState.plugboard,
      rotors: machineState.rotors.map((rotor) => {
        return {
          ...rotor,
          position: 0,
          visualPosition: 0,
        }
      }),
      reflector: machineState.reflector,
    })

    setPlainText(e.target.value)
    setCipherText(machine.encodeString(e.target.value))
    setMachineState(machine.exportMachineState())
    setTransformationLog(machine.exportTransformationLog())
  }

  const handleClickSendConfig = () => {
    const rotor: RotorConfig = {
      rotors: [
        {
          name: machineState.rotors[0].name,
          position: machineState.rotors[0].position
        },
        {
          name: machineState.rotors[1].name,
          position: machineState.rotors[1].position
        },
        {
          name: machineState.rotors[2].name,
          position: machineState.rotors[2].position
        },
      ]
    }
    const plug: PlugConfig = { substitutions: machineState.plugboard }
    const config: Config = { rotorConfig: rotor, substitutionConfig: plug, message: cipherText }

    sendMessage(JSON.stringify(config))
  };

  useEffect(() => {
    if(lastMessage !== null) {
      alert(lastMessage.data)
      // const configs: Config = lastMessage.data as Config
      // alert(`
      // ROTORS :
      //   - ${configs.rotorConfig?.rotors[0].name} = ${configs.rotorConfig?.rotors[0].position}
      //   - ${configs.rotorConfig?.rotors[1].name} = ${configs.rotorConfig?.rotors[1].position}
      //   - ${configs.rotorConfig?.rotors[2].name} = ${configs.rotorConfig?.rotors[2].position}
      // MESSAGE :
      //   => ${configs.message}
      // `)
    }
  }, [lastMessage])

  return (
    <div>
      <div className='flex h-screen flex-col md:h-[calc(100vh-2rem)] md:flex-row md:gap-8 md:p-8 md:pb-0'>
        <div
          className="relative h-[70vh] border bg-black md:h-full md:w-[calc(100vw-6rem-372px)] md:rounded-md xl:w-[calc(100vw-6rem-520px)] border-slate-800">
          <RotorsScene
            {...{
              machineState,
              transformationLog,
              setMachineState,
              clearMachine,
            }}
          />
          <div className='absolute left-6 top-6 z-10 text-xs uppercase tracking-[0.15em] text-gray-500'>
            <div className='mb-4 flex items-center gap-2'>
              <div className='h-3 w-3 rounded-full bg-yellow-500' />
              Input
            </div>
            <div className='flex items-center gap-2'>
              <div className='h-3 w-3 rounded-full bg-pink-500' />
              Output
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0">
            <PanelHeader
              title="Rotors"
              connected={readyState === ReadyState.OPEN}
              onSendClick={handleClickSendConfig}
              toolTipPosition='inside'
            />
          </div>
        </div>
        <div className='flex flex-col md:w-[372px] md:gap-8 xl:w-[520px]'>
          <div
            className="relative z-10 flex h-[30vh] grow flex-col border bg-black md:h-auto md:rounded-md border-slate-800">
            <IO {...{ onTextAreaChange, plainText, cipherText, textareaRef }} />

            <PanelHeader
              title='Input / Output'
              connected={false}
              onSendClick={undefined}
              />

            {transformationLog?.plugboard.forwards.enter && (
              <>
                <div className='absolute left-[25%] top-[100%] hidden h-8 w-[2px] bg-yellow-500 md:block'>
                  <div className='absolute left-[50%] top-0 h-1.5 w-1.5 translate-x-[-50%] translate-y-[-50%] rounded-full bg-yellow-500' />
                  <div className='absolute left-[50%] top-[100%] h-2 w-2 translate-x-[-50%] translate-y-[calc(-50%-0.2rem)] rotate-45 border-2 border-l-0 border-t-0 border-yellow-500' />
                  <div className='absolute left-[100%] top-[50%] translate-x-2 translate-y-[-50%] text-xs text-yellow-500'>
                    {transformationLog.plugboard.forwards.enter}
                  </div>
                </div>

                <div className='absolute left-[75%] top-[100%] hidden h-8 w-[2px] bg-pink-500 md:block'>
                  <div className='absolute left-[50%] top-[100%] h-1.5 w-1.5 translate-x-[-50%] translate-y-[-50%] rounded-full bg-pink-500' />
                  <div className='absolute left-[50%] top-0 h-2 w-2 translate-x-[-50%] translate-y-[calc(-50%+0.2rem)] rotate-[225deg] border-2 border-l-0 border-t-0 border-pink-500' />
                  <div className='absolute left-[100%] top-[50%] translate-x-2 translate-y-[-50%] text-xs text-pink-500'>
                    {transformationLog.plugboard.backwards.exit}
                  </div>
                </div>
              </>
            )}
          </div>
          <div
            className="relative rounded-md border bg-black border-slate-800">
            <Plugboard
              {...{ machineState, transformationLog, setMachineState }}
            />

            <PanelHeader
              title='Plugboard'
              connected={false}
              onSendClick={undefined}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
