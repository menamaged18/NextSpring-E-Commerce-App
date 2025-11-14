import { ButtonHTMLAttributes, ReactNode } from "react"

interface Iprops extends ButtonHTMLAttributes<HTMLButtonElement>{
    children: ReactNode,
    className: string,
}

function Button({children, className, ...rest}: Iprops) {
  return (
    <button className={`${className} flex-1 h-10 rounded-md`} {...rest} >{children}</button>
  )
}

export default Button