import React from "react"
import numeral from "numeral"

function CurrencyFormat({ amount }) {
  return (
    <div className='ml-3 mb-2 text-md font-mono'>
      {numeral(amount).format("$0,0.00")}
    </div>
  )
}
export default CurrencyFormat