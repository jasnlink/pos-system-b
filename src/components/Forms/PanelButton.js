import React from 'react'
import './PanelButton.css'

import { ReactComponent as PrintIcon } from './assets/printIcon.svg'
import { ReactComponent as PrintAllIcon } from './assets/printAllIcon.svg'
import { ReactComponent as BackIcon } from './assets/backIcon.svg'
import { ReactComponent as ConfirmIcon } from './assets/confirmIcon.svg'
import { ReactComponent as SplitIcon } from './assets/splitIcon.svg'
import { ReactComponent as PaymentIcon } from './assets/paymentIcon.svg'
import { ReactComponent as DiscountIcon } from './assets/discountIcon.svg'
import { ReactComponent as RemoveIcon } from './assets/removeIcon.svg'


function PanelButton({ type, disabled=false, onClick }) {

	switch(type) {
		case 'print':
			return (
				<div className="print-btn panel-btn" onClick={onClick}>
					<PrintIcon className="panel-icon" /> Print
				</div>
			)
		case 'printAll':
			return (
				<div className="print-all-btn panel-btn" onClick={onClick}>
					<PrintAllIcon className="panel-icon" /> Print All
				</div>
			)
		case 'confirm':
			return (
				<div className="confirm-btn panel-btn" onClick={onClick}>
					<ConfirmIcon className="panel-icon" /> Select
				</div>
			)
		case 'back':
			return (
				<div className="back-btn panel-btn" onClick={onClick}>
					<BackIcon className="panel-icon" /> Back
				</div>
			)
		case 'split':
			return (
				<div className="split-btn panel-btn" onClick={onClick}>
					<SplitIcon className="panel-icon" /> Split
				</div>
			)
		case 'payment':
			return (
				<div className="payment-btn panel-btn" onClick={onClick}>
					<PaymentIcon className="panel-icon" /> Payment
				</div>
			)
		case 'discount':
			return (
				<div className="discount-btn panel-btn" onClick={onClick}>
					<DiscountIcon className="panel-icon" /> Discount
				</div>
			)
		case 'remove':
			return (
				<div className={disabled ? "remove-btn-disabled panel-btn" : "remove-btn panel-btn"} onClick={onClick}>
					<RemoveIcon className="panel-icon" /> Remove
				</div>
			)
		default:
			return null
	}

}
export default PanelButton