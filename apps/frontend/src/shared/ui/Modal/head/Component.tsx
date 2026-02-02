import React, { ReactNode } from "react"

export const Component: React.FC<{children: ReactNode}> = ({children}) => (
    <div className="bg-foreground/20 w-full rounded flex items-center justify-between p-2">{children}</div>
)