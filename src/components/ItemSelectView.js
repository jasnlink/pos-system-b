import React, { useState, useEffect, useRef } from 'react'
import './ItemSelectView.css'

import OrderDisplay from './Forms/OrderDisplay'
import PanelButton from './Forms/PanelButton'

function ItemSelectView({ 
	timezone,
	setStep, 
	selectedTable, 
	setSelectedTable,
	selectedClient, 
	setSelectedClient, 
	clients,
	setClients,
	categories, 
	setCategories, 
	items, 
	setItems, 
	order, 
	setOrder 
}) {

	//use a ref to keep data fresh
	const orderRef = useRef()

	//tracks currently selected list items
	const [selectedItemInList, setSelectedItemInList] = useState()
	const [selectedCategoryInList, setSelectedCategoryInList] = useState()
	const [selectedLineItemInList, setSelectedLineItemInList] = useState()

	useEffect(() => {

		//initialization

		//fetch all catgories and populate list
		window.api.call('list-category')
		window.api.reply('list-category', (event, res) => {

			setCategories(res)

			//fetch or create order for the current client and table
			window.api.call('fetch-order', {
				tableId: selectedTable.table_id,
				clientId: selectedClient.client_id
			})
			window.api.reply('fetch-order', (event, res) => {

				setOrder(res)

			})

		})

		//on component unmount functions
		return () => {

			//empty lists
			setCategories([])
			setItems([])

			//check on exit, if the order is empty
			//so we can know it need to cleanup by closing the table or the client
			if (orderRef.current['line_items'].length === 0) {

				//if there is only 1 client, then close the table as well
				if (clients.length <= 1) {
					
					window.api.call('close-table', {
						tableId: selectedTable.table_id
					})

					setSelectedClient()
					setSelectedTable()
					setOrder()

				} else {
				//if there are more than 1 client remaining, only close this client

					window.api.call('close-client', {
						tableId: selectedTable.table_id,
						clientId: orderRef.current.client_id
					})

					setSelectedClient()
					setOrder()

				}
				
			}

		}

	}, [])

	//keep track of order changes and push into useref to get fresh data
	useEffect(() => {

		orderRef.current = { ...order }

	}, [order])

	//handles selection in category list
	function handleSelectCategory(category) {

		setSelectedItemInList()
		setSelectedCategoryInList(category)

		window.api.call('list-item', {
			categoryId: category.category_id
		})
		window.api.reply('list-item', (event, res) => {

			//populate list
			setItems(res)

		})

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

	//adds selected item to order
	function handleAddItem(item) {

		window.api.call('add-item-order', {
			orderId: order.order_id,
			item: item
		})
		window.api.reply('add-item-order', (event, res) => {

			setOrder(res)

			//select last item in order list
			if (res['line_items']?.length) {
				setSelectedLineItemInList(res['line_items'][res['line_items'].length-1])
			} else {
				setSelectedLineItemInList()
			}

		})

	}

	//remove selected item from order
	function handleRemoveItem() {

		window.api.call('remove-item-order', {
			orderId: order.order_id,
			line: selectedLineItemInList
		})
		window.api.reply('remove-item-order', (event, res) => {

			setOrder(res)
			
			//select last item in order list
			if (res['line_items']?.length) {
				setSelectedLineItemInList(res['line_items'][res['line_items'].length-1])
			} else {
				setSelectedLineItemInList()
			}

		})

	}

	return (

		<div className="container-fluid itemview-main">
				<div className="row text-center">
					<div className="col-4 itemview-left p-0">
						<div className="row p-0 gx-0">
							<div className="order-view">
							{!!order && (

								<OrderDisplay 
									timezone={timezone}
									selectedTable={selectedTable}
									selectedClient={selectedClient}
									setSelectedClient={client => setSelectedClient(client)}
									clients={clients}
									setClients={clients => setClients(clients)}
									order={order}
									setOrder={order => setOrder(order)}
									select={selectedLineItemInList}
									selectChange={(order, item) => setSelectedLineItemInList(item)}
								/>

							)}
							</div>
						</div>
						<div className="row gx-0">
							<div className="client-panel">
								<PanelButton
									type="discount"
									onClick={() => console.log('ItemSelectView clients...',clients)}
								/>
								<PanelButton
									type="remove"
									disabled={!selectedLineItemInList}
									onClick={handleRemoveItem}
								/>
							</div>
						</div>
					</div>
					<div className="col-4 itemview-center p-0">
						<div className="row p-0 gx-0">
							<ul className="item-list">
								{items?.map((item, index) => (

									<li 
										className="item-list-element"
										key={index}
										onClick={() => handleAddItem(item)}
									>
										<div className="item-list-element-name">
											{item.item_name}
										</div>
										<div className="item-list-element-price">
											{formatPrice(item.item_price)}
										</div>
									</li>

								))}
							</ul>
						</div>
						<div className="row gx-0">
							<div className="item-panel">
								<PanelButton
									type="back"
									onClick={() => setStep(11)}
								/>
							</div>
						</div>
					</div>
					<div className="col-4 itemview-right p-0">
						<div className="row p-0 gx-0">
							<ul className="category-list">
								{categories?.map((category, index) => (

									<li 
										className={selectedCategoryInList?.category_id === category.category_id ? "category-list-element category-list-element-active" : "category-list-element"} 
										key={index}
										onClick={() => handleSelectCategory(category)}
									>
										{category.category_name}
									</li>

								))}
							</ul>
						</div>
						<div className="row gx-0">
							<div className="category-panel">
								<PanelButton
									type="split"
									onClick={() => console.log('ItemSelectView orderRef.current...', orderRef.current)}
								/>
								<PanelButton
									type="payment"
									onClick={() => console.log('ItemSelectView selectedClient...', selectedClient)}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

	)
}
export default ItemSelectView