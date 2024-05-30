function Spinner({ size = 18, color = '#1B64CE' }) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderColor: color,
          borderTopColor: 'transparent',
        }}
        className="animate-spin rounded-full border-2 border-solid"
      ></div>
    </div>
  )
}

export default Spinner
