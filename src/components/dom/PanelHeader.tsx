import React from 'react'
import { PanelHeaderProps } from '@/interfaces/interfaces'


export const PanelHeader: React.FC<PanelHeaderProps> = (props) => {
  const {
    title,
    connected,
    toolTipIsActive = false,
    toolTipPosition = 'outside',
    children,
  } = props

  return (
    <div className='relative z-[80]'>
      <div
        className={`flex items-center gap-x-1.5 rounded-full bg-black px-1.5 py-0.5 text-xs font-medium text-gray-600`}>
        {title === "Rotors" && (
          <span
            className={`inline-flex items-center gap-x-1.5 rounded-full bg-black px-1.5 py-0.5 text-xs font-medium ${connected? "text-green-600" : "text-red-600"} `}>
            <svg className={`h-1.5 w-1.5 fill-gray-400`} viewBox="0 0 6 6" aria-hidden="true">
              <circle cx={3} cy={3} r={3} color={connected? "green" : "red"} />
            </svg>
            {connected? "Connected" : "Not connected"}
          </span>
        )}
        <div className="ml-auto p-2 px-4">{title}</div>
      </div>

      {toolTipIsActive && (
        <div
          className={`absolute inset-x-0 bottom-8 overflow-auto border-slate-800 bg-black/90 p-4 text-xs text-slate-200 max-md:h-[180px] max-md:border-t md:top-auto md:h-auto md:w-[400px] md:border-blue-500 ${
            toolTipPosition == 'outside'
              ? `md:bottom-[-1px] md:left-auto md:right-[calc(100%+1px)] md:rounded-l-md md:border-y md:border-l md:bg-slate-950`
              : `bg-[rgba(0,0,0,0.6)] md:bottom-[calc(100%+1rem)] md:left-4 md:right-auto md:rounded-md md:shadow-[0_0_60px_10px_rgba(0,0,0,0.9)]`
          }`}>
          {children}
        </div>
      )}
    </div>
  )
}
