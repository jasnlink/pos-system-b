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

		//fetch all open tables
		window.api.call('list-category')
		window.api.reply('list-category', (event, res) => {

			setCategories(res)

			window.api.call('fetch-order', {
				tableId: selectedTable.table_id,
				clientId: selectedClient.client_id
			})
			window.api.reply('fetch-order', (event, res) => {

				setOrder(res)

			})

		})

		return () => {


			console.log('ItemSelectView unmount...')

			//if on exit, the order is empty
			if (!orderRef.current || orderRef.current['line_items']?.length === 0) {

				console.log('ItemSelectView unmount... order is empty...')

				//if there is only 1 client, then close the table as well
				if (clients.length <= 1) {
					
					console.log('ItemSelectView unmount... clients <= 1', clients)

					window.api.call('close-table', {
						tableId: selectedTable.table_id
					})

					setSelectedClient()
					setSelectedTable()
					setOrder()

				} else {
				//if there are more than 1 client, only close this client

					console.log('ItemSelectView unmount... clients > 1', clients)

					window.api.call('close-client', {
						clientId: selectedClient.client_id
					})

					setSelectedClient()
					setOrder()

				}
				
			}

		}

	}, [])

	useEffect(() => {

		orderRef.current = { ...order }

	}, [order])

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

	function handleAddItem(item) {

		window.api.call('add-item-order', {
			orderId: order.order_id,
			item: item
		})
		window.api.reply('add-item-order', (event, res) => {

			setOrder(res)

		})
	}

	function handleRemoveItem() {

		window.api.call('remove-item-order', {
			orderId: order.order_id,
			line: selectedLineItemInList
		})
		window.api.reply('remove-item-order', (event, res) => {

			setSelectedLineItemInList()
			setOrder(res)

		})
	}

	return (

		<div className="container-fluid itemview-main">
				<div className="row text-center">
					<div className="col-4 itemview-left p-0">
						<div className="row p-0 gx-0">
						{!!order && (

							<OrderDisplay 
								timezone={timezone}
								table={selectedTable}
								client={selectedClient}
								order={order}
								select={selectedLineItemInList}
								selectChange={sel => setSelectedLineItemInList(sel)}
							/>

						)}
							
						</div>
						<div className="row gx-0">
							<div className="client-panel">
								<PanelButton
									type="discount"
									onClick={() => console.log('ItemSelectView Order...',order)}
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
export default ItemSelectView