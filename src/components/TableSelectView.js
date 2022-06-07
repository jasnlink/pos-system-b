import React, { useState } from 'react'

import './TableSelectView.css'

import Keypad from './Forms/Keypad'
import TableNumberDisplay from './Forms/TableNumberDisplay'

function TableSelectView({ setStep, selectedTable, setSelectedTable }) {

	const [tableInputDisplay, setTableInputDisplay] = useState('')

	function handleKeypadInput(key) {

		//max table number digit length
		const maxLength = 6

		let cacheInput = tableInputDisplay
		
		if(key >= 0 && key <= 9) {

			//we've reached max length and not pressing backspace or enter
			if(cacheInput.length >= maxLength) {
				return
			}
			return setTableInputDisplay(cacheInput+key)
		}
		if(key === 'del') {

			//nothing to delete if input is empty
			if (cacheInput.length <= 0) {
				return
			}

			//input not empty, so delete 1 digit
			cacheInput = cacheInput.slice(0, -1)
			return setTableInputDisplay(cacheInput)
		}
		if(key === 'enter') {

			//nothing to enter if input is empty
			if (cacheInput.length <= 0) {
				return
			}

			return window.api.fetchTable(parseInt(tableInputDisplay))
			.then((res) => {
				console.log(res)
				return setTableInputDisplay('')
			})
			
		}

		return
		
	}

	return (

			<div className="container-fluid tableview-main">
				<div className="row text-center">
					<div className="col-4 view-left pt-4">
						<h1 className="display-6 display-title">
							We in!
						</h1>
					</div>
					<div className="col-4 view-center pt-4">
						<h1 className="display-6 display-title">
							Table List
						</h1>
					</div>
					<div className="col-4 view-right pt-4">
						<h1 className="display-6 display-title">
							Table Number
						</h1>
						<TableNumberDisplay
							tableInputDisplay={tableInputDisplay}
						/>
						<Keypad
							handleKeypadInput={handleKeypadInput}
						/>
					</div>
				</div>
			</div>

	)
}

export default TableSelectView