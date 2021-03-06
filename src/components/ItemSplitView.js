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

	//loading state
	const [loading, setLoading] = useState(true)

	//stores the aggregate state of current clients and orders, separated as array elements labelled by index
	//need to store it so we undo/redo
	const [contextState, setContextState] = useState([])

	//current index of the aggregate state
	const [contextStateCursor, setContextStateCursor] = useState(0)

	//current on screen clients and their orders
	const [onScreenDisplay, setOnScreenDisplay] = useState({
			clients: [],
			orders: []
		})

	//keeps track of the current page to offset
	const [onScreenDisplayOffset, setOnScreenDisplayOffset] = useState(0)

	//tracks currently selected item in lists
	const [selectedLineItemInList, setSelectedLineItemInList] = useState()


	useEffect(() => {

		//listen to all clients being fetched
		window.api.multiple('fetch-table-client-number', (event, res) => {handleFetchClientOrders(event, res)})
		//listen to all orders being fetched
		window.api.multiple('fetch-order', (event, res) => {assignClientOrders(event, res)})

		buildClientOrders(onScreenDisplayOffset)
		
		return (() => {

			console.log('unmount...')

			window.api.close('fetch-table-client-number')
			window.api.close('fetch-order')

		})

	}, [])


	function handleFetchClientOrders(event, res) {

		//contains current on screen clients and orders
		let onScreen = onScreenDisplay

		//assign client place in array based on client number
		//modulo 6 because 6 clients per screen
		let clientAssignmentIndex = ((res.client_number)-1)%6

		onScreen.clients[clientAssignmentIndex] = res

		window.api.call('fetch-order', {
			tableId: selectedTable.table_id,
			clientId: res.client_id
		})

		setOnScreenDisplay(onScreen)

	}

	function assignClientOrders(event, res) {

		//contains current on screen clients and orders
		let onScreen = onScreenDisplay

		//match order client_id with client client_id to assign the right order place in array
		let orderAssignmentIndex = onScreen.clients.findIndex(client => client.client_id === res.client_id)

		onScreen.orders[orderAssignmentIndex] = res

		setOnScreenDisplay(onScreen)

		setLoading(false)

	}


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

		let currentClient

		//loop in multiples of 6 depending on offset
		//and fetch clients
		for(let n = start; n<= end; n++) {

			window.api.call('fetch-table-client-number', {
				tableId: selectedTable.table_id,
				clientNumber: n
			})
			

		}

		return null

	}

	function onChangeDisplayOffset(direction) {

		setLoading(true)

		let offset

		if (direction === 'prev') {
			offset = -1
		}
		if (direction === 'next') {
			offset = 1
		}

		offset += onScreenDisplayOffset
		setOnScreenDisplayOffset(offset)

		clearClientOrders()
		.then((res) => {

			buildClientOrders(offset)

		})
		
	}

	async function clearClientOrders() {

		const cache = onScreenDisplay.orders

		for (order of cache) {

			if (order['line_items'].length === 0) {

				window.api.call('close-client', {
					tableId: selectedTable.table_id,
					clientId: order.client_id
				})

			}

		}

		return null

	}

	function handleGoBack() {

		clearClientOrders()
		.then(() => {
			setStep(11) // to client select view
		})

	}

	function handleSplitItem(item) {



	}

	function handleMoveItem(order, item) {

		window.api.call('move-item-order', {
			order: order,
			lineItem: item
		})
		window.api.reply('move-item-order', (event, res) => {

			setSelectedLineItemInList(res)
			setLoading(true)

			buildClientOrders(onScreenDisplayOffset)

		})
		

	}

	return (
		<>

		{!!loading && (

			<div>loading...</div>

		)}
		{!loading && (

		<div className="container-fluid itemsplitview-main">
			<div className="row text-center">
				<div className="col-4 itemsplitview-left p-0">
					<div className="row p-0 gx-0">
						<div className="order-view">
							
							{onScreenDisplay?.orders?.map((order, index) => (
							<>
								{(index === 0 || index === 3) && (
									<div className="order-split-view" key={index}>
										<OrderDisplay 
											timezone={timezone}
											selectedTable={selectedTable}
											selectedClient={onScreenDisplay.clients[index]}
											setSelectedClient={client => setSelectedClient(client)}
											clients={onScreenDisplay.clients}
											setClients={clients => setClients(clients)}
											order={order}
											setOrder={order => setOrder(order)}
											select={selectedLineItemInList}
											selectChange={sel => setSelectedLineItemInList(sel)}
											handleMoveItem={(order, item) => handleMoveItem(order, item)}
											splitmode
										/>
									</div>
								)}
							</>
							))}
								
						</div>
					</div>
					<div className="row gx-0">
						<div className="itemsplit-panel">
							<PanelButton
								type="undo"
							/>
							<PanelButton
								type="undoAll"
							/>
						</div>
					</div>
				</div>
				<div className="col-4 itemsplitview-center p-0">
					<div className="row p-0 gx-0">
						<div className="order-view">
							
							{onScreenDisplay?.orders?.map((order, index) => (
							<>
								{(index === 1 || index === 4) && (
									<div className="order-split-view" key={index}>
										<OrderDisplay 
											timezone={timezone}
											selectedTable={selectedTable}
											selectedClient={onScreenDisplay.clients[index]}
											setSelectedClient={client => setSelectedClient(client)}
											clients={onScreenDisplay.clients}
											setClients={clients => setClients(clients)}
											order={order}
											setOrder={order => setOrder(order)}
											select={selectedLineItemInList}
											selectChange={sel => setSelectedLineItemInList(sel)}
											handleMoveItem={(order, item) => handleMoveItem(order, item)}
											splitmode
										/>
									</div>
								)}
							</>
							))}
								
						</div>
					</div>
					<div className="row gx-0">
						<div className="itemsplit-panel">
							<PanelButton
								type="back"
								onClick={() => handleGoBack()}
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
							
							{onScreenDisplay?.orders?.map((order, index) => (
							<>
								{(index === 2 || index === 5) && (
									<div className="order-split-view" key={index}>
										<OrderDisplay 
											timezone={timezone}
											selectedTable={selectedTable}
											selectedClient={onScreenDisplay.clients[index]}
											setSelectedClient={client => setSelectedClient(client)}
											clients={onScreenDisplay.clients}
											setClients={clients => setClients(clients)}
											order={order}
											setOrder={order => setOrder(order)}
											select={selectedLineItemInList}
											selectChange={sel => setSelectedLineItemInList(sel)}
											handleMoveItem={(order, item) => handleMoveItem(order, item)}
											splitmode
										/>
									</div>
								)}
							</>
							))}
								
						</div>
					</div>
					<div className="row gx-0">
						<div className="itemsplit-panel">
							<PanelButton
								type="prev"
								onClick={() => onChangeDisplayOffset('prev')}
								disabled={onScreenDisplayOffset === 0}
							/>
							<PanelButton
								type="next"
								onClick={() => onChangeDisplayOffset('next')}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
		)}
		</>
	)
}
export default ItemSplitView