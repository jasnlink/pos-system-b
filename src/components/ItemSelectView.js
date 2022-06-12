import React, { useState, useEffect } from 'react'
import './ItemSelectView.css'

import OrderDisplay from './Forms/OrderDisplay'
import PanelButton from './Forms/PanelButton'

function ItemSelectView({ setStep, selectedTable, selectedClient, setSelectedClient, date, time }) {

	//list containing categories and items
	const [categories, setCategories] =  useState([])
	const [items, setItems] = useState([])

	//tracks currently selected list items
	const [selectedItemInList, setSelectedItemInList] = useState()
	const [selectedCategoryInList, setSelectedCategoryInList] = useState()
	const [selectedLineItemInList, setSelectedLineItemInList] = useState()

	//order object
	const [order, setOrder] = useState({})

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

				console.log(res)
				setOrder(res)

			})

		})

	}, [])


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
								<PanelButton
									type="split"
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