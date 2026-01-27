import React from 'react'

interface TroubleshootProps {
  title: string
  children: React.ReactNode
}

export function Troubleshoot({ title, children }: TroubleshootProps) {
  return (
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <h4 className="font-medium text-zinc-900 dark:text-zinc-100">{title}</h4>
      <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{children}</div>
    </div>
  )
}
