import classNames from 'classnames'

interface Props extends React.ComponentProps<'button'> {
  onColorSelect(color: string): void
  selected: string
}
function ColorChooser({ selected, onColorSelect, className, style }: Props) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {[
        '#0f172a',
        'white',
        '#4b5563',
        '#dc2626',
        '#ea580c',
        '#f59e0b',
        '#84cc16',
        '#14b8a6',
        '#06b6d4',
        '#2563eb',
        '#4f46e5',
        '#a855f7',
        '#c026d3',
        '#db2777',
        '#f43f5e',
      ].map((color) => (
        <button
          key={color}
          style={{
            backgroundColor: color,
            borderColor: color,
            ...style,
          }}
          className={classNames(
            'h-7 w-7 rounded-full border-solid shadow transition-all',
            {
              'ring ring-indigo-500 ring-offset-2': color === selected,
            },
            className
          )}
          onClick={() => onColorSelect(color)}
        />
      ))}
    </div>
  )
}

export { ColorChooser }
