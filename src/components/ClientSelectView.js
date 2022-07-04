import React, { useState, useEffect, useRef } from 'react'

import './ClientSelectView.css'


import OrderDisplay from './Forms/OrderDisplay'
import PanelButton from './Forms/PanelButton'


function ClientSelectView({ 
	timezone,
	setStep, 
	selectedTable, 
	setSelectedTable, 
	selectedClient, 
	setSelectedClient,
	clients,
	setClients,
	tables,
	setTables,
	order,
	setOrder
 }) {

	const selectedTableRef = useRef()
	const selectedClientRef = useRef()

	useEffect(() => {

		//initialization
		let assignedSelectedTable

		//fetch all open tables and populate table list
		window.api.call('list-table')
		window.api.reply('list-table', (event, res) => {

			setTables(res)

			//must check if we actually have open tables,
			//if we dont then we send user back to tableview
			if(res.length) {

				//must check if we have already have a selected table
				//if we dont then the last table was closed, we select the first one on the list for the user
				if (Object.keys(selectedTableRef.current).length === 0) {

					//save the newly assigned table, because we might need it below
					assignedSelectedTable = res[0]

					setSelectedTable(assignedSelectedTable)

					//fetch all clients in selected table
					window.api.call('list-client', {
						tableId: assignedSelectedTable.table_id,
					})

				} else {

					//fetch all clients in selected table
					window.api.call('list-client', {
						tableId: selectedTableRef.current.table_id,
					})

				}
				
				//now finally fetch all open clients and populate list
				window.api.reply('list-client', (event, res) => {

					setClients(res)

					if (res.length) {

						//if we have not already selected a client then we just closed one,
						//we select the first one on the list for user and then fetch the order
						if (Object.keys(selectedClientRef.current).length === 0) {
							setSelectedClient(res[0])

							//check with which table selection we use to fetch the order from
							if (Object.keys(selectedTableRef.current).length === 0) {
								fetchOrder(assignedSelectedTable, res[0])

							} else {

								fetchOrder(selectedTableRef.current, res[0])

							}
						} else {
							//if a client is already selected then we come from item select view or item split view, just reload the order for fresh order data
							fetchOrder(selectedTableRef.current, selectedClientRef.current)

						}
						
					}
						
				})

			//no open tables, go back to table select
			} else {

				handleGoBack()

			}
			
		})


	}, [])

	//use refs in order to get fresh data, need to update as soon as the state changes
	useEffect(() => {

		selectedTableRef.current = { ...selectedTable }

	}, [selectedTable])

	useEffect(() => {

		selectedClientRef.current = { ...selectedClient }

	}, [selectedClient])


	//fetches corresponding order according to table id and client id
	//it will create a brand new order if no order exists
	function fetchOrder(table, client) {

		window.api.call('fetch-order', {
			tableId: table.table_id,
			clientId: client.client_id
		})
		window.api.reply('fetch-order', (event, res) => {

			setOrder(res)
			window.api.close('fetch-order')
		})
	}

	//handles table selection in table list
	function handleSelectTable(table) {

		setSelectedTable(table)

		//fetch all clients in selected table
		window.api.call('list-client', {
			tableId: table.table_id,
		})
		window.api.reply('list-client', (event, res) => {

			setClients(res)
			setSelectedClient(res[0])
			fetchOrder(table, res[0])

		})
	}

	//handles client selection in client list
	//e.detail to see if single or double click
	function handleSelectClient(e, client) {

		switch(e.detail) {
			case 1:
				setSelectedClient(client)
				fetchOrder(selectedTable, client)
				break;
			case 2:
				setSelectedClient(client)
				fetchOrder(selectedTable, client)
				setStep(20) //to item select view
				break;
		}

	}

	function handleGoBack() {

		setSelectedTable()
		setSelectedClient()
		setOrder()
		setStep(10) //to table select view
		
	}


	return (

		<div className="container-fluid clientview-main">
				<div className="row text-center">
					<div className="col-4 clientview-left p-0">
						<div className="row p-0 gx-0">
							<div className="order-view">
								<OrderDisplay 
									timezone={timezone}
									selectedTable={selectedTable}
									selectedClient={selectedClient}
									setSelectedClient={client => setSelectedClient(client)}
									clients={clients}
									setClients={clients => setClients(clients)}
									order={order}
									setOrder={order => setOrder(order)}
									clientmode
								/>
							</div>
						</div>
						<div className="row gx-0">
							<div className="client-panel">
								<PanelButton
									type="print"
									onClick={() => console.log('ClientSelectView Order...', order)}
								/>
								<PanelButton
									type="printAll"
									onClick={() => console.log('ClientSelectView clients...', clients)}
								/>
							</div>
						</div>
					</div>
					<div className="col-4 clientview-center p-0">
						<div className="row p-0 gx-0">
							<ul className="client-list">
								{clients && (
									<>
									{clients.map((client, index) => (

										<li 
											className={selectedClient?.client_id === client.client_id ? "client-list-element client-list-element-active" : "client-list-element"} 
											key={index}
											onClick={(e) => handleSelectClient(e, client)}
										>
											Client #{client.client_number}
										</li>

									))}
									</>
								)}
								
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
									onClick={() => setStep(20)} //to ItemSelectView
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
									onClick={() => setStep(30)} //to ItemSplitView
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