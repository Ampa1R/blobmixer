import classNames from 'classnames/bind'

import s from './Button.module.scss'
var cn = classNames.bind(s)

const Button = ({ children, className, variant = 'primary', ...props }) => (
  <button className={cn('button', { [variant]: true }, className)} {...props}>
    {children}
  </button>
)

export default Button
