import React from 'react'
import './OrderDisplay.css'

import { ReactComponent as LeftArrowIcon } from './assets/leftArrowIcon.svg'
import { ReactComponent as RightArrowIcon } from './assets/rightArrowIcon.svg'

function OrderDisplay({ table, client, order, select, selectChange }) {


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

	return (
		<>
		<div className="order-view">
			<div className="line-list-header">
			{!!selectChange && (
				<>
					<div className="line-list-header-front">
						<h1 className="line-list-header-title-front">
							Table #{table.table_number}
						</h1>
					</div>
				
					<div className="line-list-header-back">
						<div className="client-prev-btn">
							<LeftArrowIcon className="left-arrow-icon" />
						</div>
						<h1 className="line-list-header-title-back">
							Client #{client.client_number}
						</h1>
						<div className="client-prev-btn">
							<RightArrowIcon className="right-arrow-icon" />
						</div>
					</div>
				</>
			)}
			{!selectChange && (
				<h1 className="line-list-header-title-front">
					#{order.order_id}
				</h1>
			)}	
			</div>
			<ul className="line-list">
				
				{order?.line_items?.map((line, index) => (
				<>
					<li
						className={selectChange ? (
								select?.order_line_id === line.order_line_id ? "line-list-element line-list-element-active" : "line-list-element"
							) : "line-list-element-disabled"} 
						key={index}
						onClick={selectChange ? () => selectChange(line) : null}
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
			<ul className="total-list">
				<li
					className="total-list-element"
				>
					<div className="total-list-element-front">
						<div className="total-list-element-name">
							SUBTOTAL
						</div>
					</div>
					<div className="total-list-element-price">
						{formatPrice(order.order_subtotal)}
					</div>
				</li>
				<li
					className="total-list-element"
				>
					<div className="total-list-element-front">
						<div className="total-list-element-name">
							TPS
						</div>
					</div>
					<div className="total-list-element-price">
						{formatPrice(order.order_tps)}
					</div>
				</li>
				<li
					className="total-list-element"
				>
					<div className="total-list-element-front">
						<div className="total-list-element-name">
							TVQ
						</div>
					</div>
					<div className="total-list-element-price">
						{formatPrice(order.order_tvq)}
					</div>
				</li>
				<li
					className="total-list-element"
				>
					<div className="total-list-element-front">
						<div className="total-list-element-name">
							TOTAL
						</div>
					</div>
					<div className="total-list-element-price">
						{formatPrice(order.order_total)}
					</div>
				</li>
			</ul>
				
		</div>
		</>
	)

}
export default OrderDisplay