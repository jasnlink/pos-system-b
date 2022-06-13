import React, { useState, useEffect } from 'react'

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

	useEffect(() => {

		//initialization

		//fetch all open tables
		window.api.call('list-table')
		window.api.reply('list-table', (event, res) => {

			setTables(res)

			if(res.length) {

				//fetch all clients in selected table
				window.api.call('list-client', {
					tableId: selectedTable.table_id,
				})
				window.api.reply('list-client', (event, res) => {

					setClients(res)

					if(res.length) {

						setSelectedClient(res[0])
						fetchOrder(selectedTable, res[0])

					} else {

						setSelectedClient()

					}
						
				})

			//no open tables, go back to table select
			} else {

				handleGoBack()

			}
			
		})


	}, [])

	function fetchOrder(table, client) {

		window.api.call('fetch-order', {
			tableId: table.table_id,
			clientId: client.client_id
		})
		window.api.reply('fetch-order', (event, res) => {

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
			fetchOrder(table, res[0])

		})
	}

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
							<OrderDisplay 
								timezone={timezone}
								table={selectedTable}
								client={selectedClient}
								order={order}
							/>
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
								{clients?.map((client, index) => (

									<li 
										className={selectedClient?.client_id === client.client_id ? "client-list-element client-list-element-active" : "client-list-element"} 
										key={index}
										onClick={(e) => handleSelectClient(e, client)}
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