import React, { useState, useEffect } from 'react'

import './ClientSelectView.css'

import { ReactComponent as CancelIcon } from './assets/cancelIcon.svg'
import { ReactComponent as ConfirmIcon } from './assets/confirmIcon.svg'


function ClientSelectView({ setStep, selectedTable, setSelectedTable, selectedClient, setSelectedClient }) {

	const [tables, setTables] = useState([])
	const [clients, setClients] = useState([])

	useEffect(() => {

		//initialization

		//fetch all open tables
		window.api.call('list-table')
		window.api.reply('list-table', (event, res) => {

			setTables(res)

			//fetch all clients in selected table
			window.api.call('list-client', {
				tableId: selectedTable.table_id,
			})
			window.api.reply('list-client', (event, res) => {

				//if there are clients associated with the table
				//then it is an existing table
				if (res.length) {

					setClients(res)
					setSelectedClient(res[0])

				} else {
					//if there are not clients associated yet
					//with the table then it is a new table
					//we then move one straight to creating the first client
					//and they can start adding items to the order

					//fetch all clients in selected table
					window.api.call('new-table-client', {
						tableId: selectedTable.table_id,
					})
					window.api.reply('new-table-client', (event, res) => {
						setSelectedClient(res)
						setStep(20)
					})

				}

			})
			
		})

	}, [])

	function handleSelectTable(table) {

		setSelectedTable(table)

		//fetch all clients in selected table
		window.api.call('list-client', {
			tableId: table.table_id,
		})
		window.api.reply('list-client', (event, res) => {

			setClients(res)
			setSelectedClient(res[0])

		})
	}

	return (

		<div className="container-fluid clientview-main">
				<div className="row text-center">
					<div className="col-4 clientview-left p-0">
						<div className="row p-0 gx-0">
							<ul className="client-list">
								<h1 className="display-6 display-title">
									Client #{selectedClient?.client_number}
								</h1>
							</ul>
						</div>
						<div className="row gx-0">
							<div className="client-panel">

							</div>
						</div>
					</div>
					<div className="col-4 clientview-center p-0">
						<div className="row p-0 gx-0">
							<ul className="client-list">
								{clients?.map((client, index) => (

									<li 
										className={selectedClient?.client_id === client.client_id ? "client-list-item client-list-item-active" : "client-list-item"} 
										key={index}
										onClick={() => setSelectedClient(client)}
									>
										Client #{client.client_number}
									</li>

								))}
							</ul>
						</div>
						<div className="row gx-0">
							<div className="client-panel">
								
							</div>
						</div>
					</div>
					<div className="col-4 clientview-right p-0">
						<div className="row p-0 gx-0">
							<ul className="table-list">
								{tables?.map((table, index) => (

									<li 
										className={selectedTable?.table_id === table.table_id ? "table-list-item table-list-item-active" : "table-list-item"} 
										key={index}
										onClick={() => handleSelectTable(table)}
									>
										Table #{table.table_number}
									</li>

								))}
							</ul>
						</div>
						<div className="row gx-0">
							<div className="client-panel">

							</div>
						</div>
					</div>
				</div>
			</div>
	)
}

export default ClientSelectView