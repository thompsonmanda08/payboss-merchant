import React, { useState } from 'react'

const Option = (props) => {
  const isSelected = props.index === props.selectedIndex
  return (
    <div
      className={`mx-1 flex w-full min-w-fit flex-1 cursor-pointer  items-center gap-2 rounded-md p-2  py-3 text-xs font-bold text-slate-600 transition duration-300 hover:shadow-md lg:text-sm lg:font-normal ${
        isSelected && 'bg-sky-100/20'
      }`}
      onClick={() => props.onSelect(props.index)}
    >
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full border transition ${
          isSelected && 'border-2 border-primary '
        } `}
      >
        <div
          className={`aspect-square h-[80%] w-[80%] rounded-full border transition ${
            isSelected && 'bg-primary'
          } `}
        />
      </div>
      {props.children}
    </div>
  )
}

function CustomRadioGroup({ options, onChange, value = 0, labelText }) {
  const [selectedIndex, setSelectedIndex] = useState(value)

  function onSelect(index) {
    setSelectedIndex(index)
    onChange && onChange(index)
  }

  return (
    <div className="flex w-full flex-col gap-y-2">
      {labelText && (
        <label className="text-sm font-medium leading-[1.125rem] tracking-wide text-slate-500">
          {labelText}
        </label>
      )}
      <div className="flex min-w-full flex-1 flex-row justify-between">
        {options.map((el, index) => (
          <Option
            key={index}
            index={index}
            selectedIndex={selectedIndex}
            onSelect={(index) => onSelect(index)}
          >
            {el}
          </Option>
        ))}
      </div>
    </div>
  )
}

export default CustomRadioGroup
