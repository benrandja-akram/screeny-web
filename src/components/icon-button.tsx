import classNames from 'classnames'

function IconButton({
  children,
  isActive,
  className,
  size = 'default',
  ...props
}: React.ComponentProps<'button'> & {
  isActive?: boolean
  size?: 'default' | 'small'
}) {
  return (
    <button
      className={classNames(
        'flex items-center justify-center rounded-lg transition focus:outline-none active:text-indigo-600',
        className,
        {
          'bg-indigo-600 text-white': isActive,
          'hover:bg-gray-100': !isActive,
          'h-10 w-10': size === 'default',
          'h-9 w-9': size === 'small',
        }
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export { IconButton }
