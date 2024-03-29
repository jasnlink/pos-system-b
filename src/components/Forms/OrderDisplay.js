import React, { useState, useEffect } from 'react'
import './OrderDisplay.css'

import { ReactComponent as LeftArrowIcon } from './assets/leftArrowIcon.svg'
import { ReactComponent as RightArrowIcon } from './assets/rightArrowIcon.svg'
import { ReactComponent as LineSeparateIcon } from './assets/separateIcon.svg'
import { ReactComponent as TargetIcon } from './assets/targetIcon.svg'

function OrderDisplay({ 
	timezone, 
	selectedTable, 
	selectedClient, 
	setSelectedClient,
	clients,
	setClients,
	order, 
	setOrder,
	select, 
	selectChange,
	handleMoveItem,
	clientmode=false,
	splitmode=false 
}) {


	const [loading, setLoading] = useState(true)

	useEffect(() => {

		if(selectedTable && selectedClient && order) {
			setLoading(false)
		}

	}, [selectedTable, selectedClient, order])


	//handles switching to previous or next client in the list
	function handleSwitchClient(direction) {


		//find current index in list of currently selected client,
		//it is used to select the next or previous client in the list
		const currentClientListIndex = clients.findIndex(element => element.client_id === selectedClient.client_id)
		const currentOrder = order
		const currentClientListLength = clients.length

		if (direction === 'next') {

			//call next table client
			window.api.call('next-table-client', {
				tableId: selectedTable.table_id,
				clientNumber: selectedClient.client_number
			})
			window.api.reply('next-table-client', (event, res) => {

				//populate list and select next client
				setClients(res)
				setSelectedClient(res[currentClientListIndex+1])

				//fetch or create corresponding order
				window.api.call('fetch-order', {
					tableId: selectedTable.table_id,
					clientId: res[currentClientListIndex+1].client_id
				})
				window.api.reply('fetch-order', (event, res) => {

					setOrder(res)

					//cleanup client order, if its empty then we close it
					if (currentOrder['line_items'].length === 0) {

						window.api.call('close-client', {
							tableId: selectedTable.table_id,
							clientId: clients[currentClientListIndex].client_id
						})
						window.api.reply('close-client', (event, res) => {

							setClients(res)
							setSelectedClient(res[currentClientListIndex])


						})

					}

				})

			})

		} else if (direction === 'prev') {

			//call prev table client
			window.api.call('prev-table-client', {
				tableId: selectedTable.table_id,
				clientNumber: selectedClient.client_number
			})
			window.api.reply('prev-table-client', (event, res) => {

				//populate list and select prev client
				setClients(res)

				//check if we created a new client from switching to an uncreated client
				//we do this by comparing the new client list length with the old client list length
				//if we did not create a new client from switching to the prev client, then we continue as normal
				//if we did create one then the list has shifted one index to the right, so we simply select the same index to move left one client
				if (currentClientListLength === res.length) {

					setSelectedClient(res[currentClientListIndex-1])

					//fetch or create corresponding order
					window.api.call('fetch-order', {
						tableId: selectedTable.table_id,
						clientId: res[currentClientListIndex-1].client_id
					})
				} else if (currentClientListLength < res.length) {

					setSelectedClient(res[currentClientListIndex])

					//fetch or create corresponding order
					window.api.call('fetch-order', {
						tableId: selectedTable.table_id,
						clientId: res[currentClientListIndex].client_id
					})
				}
					
				window.api.reply('fetch-order', (event, res) => {

					setOrder(res)

					//cleanup client order, if its empty then close it
					if (currentOrder['line_items'].length === 0) {

						window.api.call('close-client', {
							tableId: selectedTable.table_id,
							clientId: clients[currentClientListIndex].client_id

						})
						window.api.reply('close-client', (event, res) => {

							setClients(res)

						})

					}

				})

			})

		}

	}

	//formats price from cents to dollars
	function formatPrice(price) {

		if (price === 0) {
			return '$0.00'
		}

		if(!price) {
			return null
		}

		price = price.toString()

		if (price.length > 2) {
			let dollars = price.slice(0, -2)
			let cents = price.slice(-2, price.length)

			return '$' + dollars + '.' + cents
		}

		if (price.length === 2) {
			return '$0.' + price
		}

		if (price.length === 1) {
			return '$0.0' + price
		}
		
		return null

	}

	//formats datetime to local time
	function formatDatetime(dateString) {

		let formattedDate = new Date(dateString+' GMT')

		return formattedDate.toLocaleString('en-US', { timeZone: timezone })

	}

	//split item handler
	function handleSplitItem(item) {

		console.log(item)
		//this resets the selected line item to undefined
		selectChange()

	}

	return (
		<>
		{!!loading && (

			<div>loading...</div>

		)}
		{!loading && (
		<>
			<div className={selectChange ? "line-list-header" : "line-list-header-small"}>
			{!clientmode && !splitmode && (
				<>
					<div className="line-list-header-front">
						<h1 className="line-list-header-title-front">
							Table #{selectedTable.table_number}
						</h1>
					</div>
				
					<div className="line-list-header-back">
					{selectedClient?.client_number <= 1 && (

						<div 
							className="client-prev-btn-disabled"
						>
							<LeftArrowIcon className="left-arrow-icon" />
						</div>

					)}
					{selectedClient?.client_number > 1 && (

						<div 
							className="client-prev-btn"
							onClick={() => handleSwitchClient('prev')}
						>
							<LeftArrowIcon className="left-arrow-icon" />
						</div>

					)}
						
						<h1 className="line-list-header-title-back">
							Client #{selectedClient?.client_number}
						</h1>
						<div 
							className="client-prev-btn"
							onClick={() => handleSwitchClient('next')}
						>
							<RightArrowIcon className="right-arrow-icon" />
						</div>
					</div>
				</>
			)}
			{!clientmode && splitmode && (
				<>
					<div className="line-list-header-front">
						<h1 className="line-list-header-title-front-small">
							Client #{selectedClient?.client_number}
						</h1>
					</div>
					{!!select && (
					<>
						<div className="line-list-header-back">
						{select?.order_id !== order?.order_id && (
						<>
							
								<div 
									className="line-move-btn"
									onClick={() => handleMoveItem(order, select)}
								>
									<TargetIcon className="line-move-icon" />
								</div>
								
							
						</>
						)}
								<div 
									className="line-separate-btn"
									onClick={() => handleSplitItem(select)}
								>
									<LineSeparateIcon className="line-separate-icon" />
								</div>
								
						</div>
					</>
					)}
				</>
			)}
			{!!clientmode && (
				<>
					<div className="line-list-header-front">
						<h1 className="line-list-header-title-front">
							Bill #{order?.order_id}
						</h1>
					</div>
					<div className="line-list-header-back">
						<h1 className="line-list-header-title-back">
							{formatDatetime(order?.created_on)}
						</h1>
					</div>
				</>

			)}
	
			</div>
			<ul className="line-list">
				
				{order?.line_items?.map((line, index) => (
				<>
					<li
						className={!clientmode ? (
								select?.order_line_id === line.order_line_id ? "line-list-element line-list-element-active" : "line-list-element"
							) : "line-list-element-disabled"} 
						key={index}
						onClick={!clientmode ? () => selectChange(order, line) : null}
					>
						<div className="line-list-element-front">
							<div className="line-list-element-quantity">
								{line.quantity}x
							</div>
							<div className="line-list-element-name">
								{line.item_name}
							</div>
						</div>
						<div className="line-list-element-price">
							{formatPrice(line.item_price)}
						</div>
					</li>
				</>
				))}
			</ul>

			{!splitmode && (

				<ul className="total-list">
					<li
						className={!clientmode ? "total-list-element" : "total-list-element-clientview"}
					>
						<div className="total-list-element-front">
							<div className="total-list-element-name">
								SUBTOTAL
							</div>
						</div>
						<div className="total-list-element-price">
							{formatPrice(order?.order_subtotal)}
						</div>
					</li>
					<li
						className={!clientmode ? "total-list-element" : "total-list-element-clientview"}
					>
						<div className="total-list-element-front">
							<div className="total-list-element-name">
								TPS
							</div>
						</div>
						<div className="total-list-element-price">
							{formatPrice(order?.order_tps)}
						</div>
					</li>
					<li
						className={!clientmode ? "total-list-element" : "total-list-element-clientview"}
					>
						<div className="total-list-element-front">
							<div className="total-list-element-name">
								TVQ
							</div>
						</div>
						<div className="total-list-element-price">
							{formatPrice(order?.order_tvq)}
						</div>
					</li>
					<li
						className={!clientmode ? "total-list-element-grandtotal" : "total-list-element-clientview-grandtotal"}
					>
						<div className="total-list-element-front">
							<div className="total-list-element-name">
								TOTAL
							</div>
						</div>
						<div className="total-list-element-price">
							{formatPrice(order?.order_total)}
						</div>
					</li>
				</ul>
			)}
		</>
		)}	
		</>
	)

}
export default OrderDisplay