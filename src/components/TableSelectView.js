import React, { useState, useEffect } from 'react'

import './TableSelectView.css'

import Keypad from './Forms/Keypad'
import TableNumberDisplay from './Forms/TableNumberDisplay'
import PanelButton from './Forms/PanelButton'


function TableSelectView({ setStep, selectedTable, setSelectedTable }) {

	//list of tables
	const [tables, setTables] = useState([])
	//selected table, but only in the list, not confirmed yet
	const [selectedTableInList, setSelectedTableInList] = useState()

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
					setStep(11)

				})
			})

			setTableInputDisplay('')

		}

		return
		
	}

	function handleSelectTable() {

		const table = selectedTableInList

		setTableInputDisplay('')
		setSelectedTable(table)
		setSelectedTableInList()
		setStep(11)

	}


	return (

			<div className="container-fluid tableview-main">
				<div className="row text-center">
					<div className="col-4 tableview-left pt-4">
						<h1 className="display-6 display-title">
							LOGO HERE
						</h1>
					</div>
					<div className="col-4 tableview-center p-0">
						<div className="row p-0 gx-0">
							<ul className="table-list">
								{tables?.map((table, index) => (

									<li 
										className={selectedTableInList?.table_id === table.table_id ? "table-list-item table-list-item-active" : "table-list-item"} 
										key={index}
										onClick={() => setSelectedTableInList(table)}
									>
										Table #{table.table_number}
									</li>

								))}
							</ul>
						</div>
						<div className="row gx-0">
							<div className="table-confirm-panel">
							{selectedTableInList && (
							<>
								<PanelButton
									type="back"
									onClick={() => setSelectedTableInList()}
								/>
								<PanelButton
									type="confirm"
									onClick={handleSelectTable}
								/>
							</>
							)}
							</div>
						</div>
					</div>
					<div className="col-4 tableview-right pt-4">
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