import React, { useState, useEffect } from 'react'

import './TableSelectView.css'

import Keypad from './Forms/Keypad'
import TableNumberDisplay from './Forms/TableNumberDisplay'
import PanelButton from './Forms/PanelButton'


function TableSelectView({ setStep, setSelectedClient, selectedTable, setSelectedTable, tables, setTables }) {

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

			handleConfirmTable(tableInputDisplay)

		}

		return
		
	}

	function handleConfirmTable(tableNumber) {


		//fetch entered table
		window.api.call('fetch-table-number', {
			tableNumber: parseInt(tableNumber),
		})
		window.api.reply('fetch-table-number', (event, res) => {

			//found table, set and move to client select
			if (res !== undefined) {

				setSelectedTableInList()
				setTableInputDisplay('')

				setSelectedTable(res)
				setStep(11) //to client select

			//table not found, create it, 
			//create first client and move to item select
			} else if (res === undefined) {

				window.api.call('new-table', {
					tableNumber: parseInt(tableNumber),
				})
				window.api.reply('new-table', (event, res) => {

					
					setSelectedTableInList()
					setTableInputDisplay('')

					setSelectedTable(res)

					//create first client in table
					window.api.call('new-table-client', {
						tableId: res.table_id,
					})
					window.api.reply('new-table-client', (event, res) => {

						setSelectedClient(res)
						setStep(20) //to item select

					})

				})

			}
		})

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
										className={selectedTableInList?.table_id === table.table_id ? "table-list-element table-list-element-active" : "table-list-element"} 
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
									onClick={() => handleConfirmTable(selectedTableInList.table_number)}
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