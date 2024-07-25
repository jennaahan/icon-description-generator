import React from 'react'

interface TabProps {
    label: "Generate"|"Edit"|"Export",
    active: boolean,
    onClick: () => void
}
  
function Tab({ label, active, onClick } : TabProps) {
  return (
    <div
      style={{
        marginRight: 16,
        color: active ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.3)",
        cursor: "default",
      }}
      onClick={onClick}
      className="type--11-pos-medium"
    >
      {label}
    </div>
  )
}

export default Tab