import classNames from 'classnames/bind'

import s from './Dots.module.scss'

const cn = classNames.bind(s)

const Dots = () => {
  return (
    <span>
      {' '}
      <span className={cn('dot')}>.</span>
      <span className={cn('dot')}>.</span>
      <span className={cn('dot')}>.</span>
    </span>
  )
}

export default Dots
