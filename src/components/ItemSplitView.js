import React, { useState, useEffect, useRef } from 'react'
import './ItemSplitView.css'

import OrderDisplay from './Forms/OrderDisplay'
import PanelButton from './Forms/PanelButton'

function ItemSplitView({ 
	timezone,
	setStep, 
	selectedTable, 
	setSelectedTable,
	selectedClient, 
	setSelectedClient, 
	clients,
	setClients,
	order, 
	setOrder 
}) {

	//stores the aggregate state of current clients and orders, separated as array elements labelled by index
	//need to store it so we undo/redo
	const [contextState, setContextState] = useState([])

	//current index of the aggregate state
	const [contextStateCursor, setContextStateCursor] = useState(0)

	//current on screen clients and their orders
	const [onScreenClients, setOnScreenClients] = useState([])


	useEffect(() => {

		//fetch or create order for the current client and table
		window.api.call('fetch-order', {
			tableId: selectedTable.table_id,
			clientId: selectedClient.client_id
		})
		window.api.reply('fetch-order', (event, res) => {

			setOrder(res)

		})

	}, [])


	//builds all clients and their orders depending on which page we are on
	async function buildClientOrders(offset) {

		//each page offset by 6 clients
		const start = (offset*6)+1
		const end = (offset+1)*6


		// [1,2,3,4,5,6] -> 0
		//
		// [7,8,9,10,11,12] -> 1
		//
		// [13,14,15,16,17,18] -> 2

		let onScreenClients = []

		for(let n = start; n<= end; n++) {

			window.api.call('fetch-table-client-number', {
				tableId: selectedTable.table_id,
				clientNumber: n
			})
			window.api.reply('fetch-table-client-number', (event, res) => {

				onScreenClients.push(res)

			})

		}

	}

	return (

		<div className="container-fluid itemsplitview-main">
				<div className="row text-center">
					<div className="col-4 itemsplitview-left p-0">
						<div className="row p-0 gx-0">
							<div className="order-view">
								<div className="order-split-view">
									<OrderDisplay 
										timezone={timezone}
										selectedTable={selectedTable}
										selectedClient={selectedClient}
										setSelectedClient={client => setSelectedClient(client)}
										clients={clients}
										setClients={clients => setClients(clients)}
										order={order}
										setOrder={order => setOrder(order)}
										splitmode
									/>
								</div>
								<div className="order-split-view">
									<OrderDisplay 
										timezone={timezone}
										selectedTable={selectedTable}
										selectedClient={selectedClient}
										setSelectedClient={client => setSelectedClient(client)}
										clients={clients}
										setClients={clients => setClients(clients)}
										order={order}
										setOrder={order => setOrder(order)}
										splitmode
									/>
								</div>
							</div>
						</div>
						<div className="row gx-0">
							<div className="itemsplit-panel">
								<PanelButton
									type="print"
								/>
								<PanelButton
									type="printAll"
								/>
							</div>
						</div>
					</div>
					<div className="col-4 itemsplitview-center p-0">
						<div className="row p-0 gx-0">
							<div className="order-view">
								<div className="order-split-view">
									<OrderDisplay 
										timezone={timezone}
										selectedTable={selectedTable}
										selectedClient={selectedClient}
										setSelectedClient={client => setSelectedClient(client)}
										clients={clients}
										setClients={clients => setClients(clients)}
										order={order}
										setOrder={order => setOrder(order)}
										splitmode
									/>
								</div>
								<div className="order-split-view">
									<OrderDisplay 
										timezone={timezone}
										selectedTable={selectedTable}
										selectedClient={selectedClient}
										setSelectedClient={client => setSelectedClient(client)}
										clients={clients}
										setClients={clients => setClients(clients)}
										order={order}
										setOrder={order => setOrder(order)}
										splitmode
									/>
								</div>
							</div>
						</div>
						<div className="row gx-0">
							<div className="itemsplit-panel">
								<PanelButton
									type="back"
									onClick={() => setStep(11)} // to client select view
								/>
							<>
								<PanelButton
									type="confirm"
								/>
							</>
							</div>
						</div>
					</div>
					<div className="col-4 itemsplitview-right p-0">
						<div className="row p-0 gx-0">
							<div className="order-view">
								<div className="order-split-view">
									<OrderDisplay 
										timezone={timezone}
										selectedTable={selectedTable}
										selectedClient={selectedClient}
										setSelectedClient={client => setSelectedClient(client)}
										clients={clients}
										setClients={clients => setClients(clients)}
										order={order}
										setOrder={order => setOrder(order)}
										splitmode
									/>
								</div>
								<div className="order-split-view">
									<OrderDisplay 
										timezone={timezone}
										selectedTable={selectedTable}
										selectedClient={selectedClient}
										setSelectedClient={client => setSelectedClient(client)}
										clients={clients}
										setClients={clients => setClients(clients)}
										order={order}
										setOrder={order => setOrder(order)}
										splitmode
									/>
								</div>
							</div>
						</div>
						<div className="row gx-0">
							<div className="itemsplit-panel">
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
export default ItemSplitView