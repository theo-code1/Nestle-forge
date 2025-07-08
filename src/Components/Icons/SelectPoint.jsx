import React from 'react'

const SelectPoint = ({ PointColor }) => {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill={PointColor} xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="44" height="44" rx="22" fill="#FF0000" stroke="white" stroke-width="4"/>
    </svg>

  )
}

export default SelectPoint