import React, { useState, useEffect } from 'react'

import './ClientSelectView.css'


import OrderDisplay from './Forms/OrderDisplay'
import PanelButton from './Forms/PanelButton'


function ClientSelectView({ setStep, selectedTable, setSelectedTable, selectedClient, setSelectedClient }) {

	const [tables, setTables] = useState([])
	const [clients, setClients] = useState([])

	//order object
	const [order, setOrder] = useState({})

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
					fetchOrder(selectedTable, res[0])

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

	function fetchOrder(table, client) {

		window.api.call('fetch-order', {
			tableId: table.table_id,
			clientId: client.client_id
		})
		window.api.reply('fetch-order', (event, res) => {

			console.log(res)
			setOrder(res)

		})
	}

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

	function handleSelectClient(client) {

		setSelectedClient(client)
		fetchOrder(selectedTable, client)

	}

	function handleGoBack() {
		if(selectedClient) {
			return setSelectedClient()
		}
		setStep(10)
		
	}

	return (

		<div className="container-fluid clientview-main">
				<div className="row text-center">
					<div className="col-4 clientview-left p-0">
						<div className="row p-0 gx-0">
							<OrderDisplay 
								table={selectedTable}
								client={selectedClient}
								order={order}
							/>
						</div>
						<div className="row gx-0">
							<div className="client-panel">
								<PanelButton
									type="print"
								/>
								<PanelButton
									type="printAll"
								/>
							</div>
						</div>
					</div>
					<div className="col-4 clientview-center p-0">
						<div className="row p-0 gx-0">
							<ul className="client-list">
								{clients?.map((client, index) => (

									<li 
										className={selectedClient?.client_id === client.client_id ? "client-list-element client-list-element-active" : "client-list-element"} 
										key={index}
										onClick={() => handleSelectClient(client)}
									>
										Client #{client.client_number}
									</li>

								))}
							</ul>
						</div>
						<div className="row gx-0">
							<div className="client-panel">
								<PanelButton
									type="back"
									onClick={handleGoBack}
								/>

							{selectedClient && (
							<>
								<PanelButton
									type="confirm"
									onClick={() => setStep(20)}
								/>
							</>
							)}
							</div>
						</div>
					</div>
					<div className="col-4 clientview-right p-0">
						<div className="row p-0 gx-0">
							<ul className="table-list">
								{tables?.map((table, index) => (

									<li 
										className={selectedTable?.table_id === table.table_id ? "table-list-element table-list-element-active" : "table-list-element"} 
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
								<PanelButton
									type="split"
									
								/>
								<PanelButton
									type="payment"
									
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
	)
}

export default ClientSelectView