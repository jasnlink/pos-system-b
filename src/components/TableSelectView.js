import React, { useState, useEffect } from 'react'

import './TableSelectView.css'

import Keypad from './Forms/Keypad'
import TableNumberDisplay from './Forms/TableNumberDisplay'

function TableSelectView({ setStep, selectedTable, setSelectedTable }) {

	const [tables, setTables] = useState([])

	useEffect(() => {

		//initialization

		//fetch all open tables
		window.api.call('list-table')
		window.api.reply('list-table', (event, res) => {

			setTables(res)
			
		})

	}, [])

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

			//fetch entered table
			window.api.call('fetch-table', {
				number: parseInt(tableInputDisplay),
			})
			window.api.reply('fetch-table', (event, res) => {
				
				setSelectedTable(res)

				//fetch all open tables
				window.api.call('list-table')
				window.api.reply('list-table', (event, res) => {

					setTables(res)
					
				})
			})

			setTableInputDisplay('')

			

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
					<div className="col-4 view-center p-0">
						<ul className="table-list">
							{tables?.map((table, index) => (

								<li 
									className={selectedTable?.table_id === table.table_id ? "table-list-item table-list-item-active" : "table-list-item"} 
									key={index}
									onClick={() => setSelectedTable(table)}
								>
									Table #{table.table_number}
								</li>

							))}
						</ul>
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