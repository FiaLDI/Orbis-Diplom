
import React from "react"

export const AppearanceButton: React.FC<{handler: ()=> void, title: string, isCurrent: boolean, theme: string}> = ({
    handler,
    title,
    isCurrent,
    theme
}) => {
    return (
        <button
            data-current={isCurrent}
            data-theme={theme}
                className={
                    "data-[theme=standart]:bg-blue-950 data-[theme=light]:bg-gray-400 data-[theme=dark]:bg-gray-900 p-10 w-[250px] data-[current=true]:border data-[current=true]:border-white cursor-pointer"
                }
                onClick={handler}
            >
                <div className="">{title}</div>
            </button>
    )
}