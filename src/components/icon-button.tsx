import classNames from 'classnames'

function IconButton({
  children,
  isActive,
  className,
  ...props
}: React.ComponentProps<'button'> & { isActive?: boolean }) {
  return (
    <button
      className={classNames(
        'flex w-10 items-center justify-center rounded-lg transition active:bg-indigo-600',
        className,
        {
          'bg-indigo-600 text-white': isActive,
          'hover:bg-gray-100': !isActive,
        }
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export { IconButton }
