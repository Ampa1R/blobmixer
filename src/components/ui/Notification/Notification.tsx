import classNames from 'classnames/bind';

import s from './Notification.module.scss';
const cn = classNames.bind(s);

const Notification = ({ children, classNames, error = false }) => (
  <span className={cn('minting', { error }, classNames)}>
    {error && <InfoIcon />}
    <span className={s.text}>{children}</span>
  </span>
);

export default Notification;

const InfoIcon = () => (
  <svg
    className={s.icon}
    width="20"
    height="19"
    viewBox="0 0 20 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10" cy="9.5" r="9" stroke="currentColor" />
    <path
      d="M10 4.5v7"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="10" cy="14.5" r="1" fill="currentColor" />
  </svg>
);
