import React, { useState, useEffect } from 'react'
import './ItemSelectView.css'

import PanelButton from './Forms/PanelButton'

function ItemSelectView({ setStep, selectedTable, selectedClient, setSelectedClient }) {

	//list containing categories and items
	const [categories, setCategories] =  useState([])
	const [items, setItems] = useState([])

	//tracks currently selected list items
	const [selectedItemInList, setSelectedItemInList] = useState()
	const [selectedCategoryInList, setSelectedCategoryInList] = useState()

	
	useEffect(() => {

		//initialization

		//fetch all open tables
		window.api.call('list-category')
		window.api.reply('list-category', (event, res) => {

			setCategories(res)

		})

	}, [])


	function handleSelectCategory(category) {

		setSelectedItemInList()
		setSelectedCategoryInList(category)

		window.api.call('list-item', {
			categoryId: category.category_id
		})
		window.api.reply('list-item', (event, res) => {

			//populate list and auto select first item in list
			setItems(res)

		})

	}

	//formats price from cents to dollars
	function formatPrice(price) {

		price = price.toString()

		let dollars = price.slice(0, -2)
		let cents = price.slice(-2, price.length)

		return dollars + '.' + cents

	}

	return (

		<div className="container-fluid itemview-main">
				<div className="row text-center">
					<div className="col-4 itemview-left p-0">
						<div className="row p-0 gx-0">
							<ul className="client-list">
								<h1 className="display-6 display-title">
									Table #{selectedTable.table_number} Client #{selectedClient.client_number}
								</h1>
							</ul>
						</div>
						<div className="row gx-0">
							<div className="client-panel">
								<PanelButton
									type="discount"
								/>
								<PanelButton
									type="remove"
								/>
							</div>
						</div>
					</div>
					<div className="col-4 itemview-center p-0">
						<div className="row p-0 gx-0">
							<ul className="item-list">
								{items?.map((item, index) => (

									<li 
										className={selectedItemInList?.item_id === item.item_id ? "item-list-item item-list-item-active" : "item-list-item"} 
										key={index}
										onClick={() => setSelectedItemInList(item)}
									>
										<div className="item-list-item-name">
											{item.item_name}
										</div>
										<div className="item-list-item-price">
											$ {formatPrice(item.item_price)}
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
										className={selectedCategoryInList?.category_id === category.category_id ? "category-list-item category-list-item-active" : "category-list-item"} 
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