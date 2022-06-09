import React from 'react'
import './ConfirmButton.css'
import { ReactComponent as ConfirmIcon } from './assets/confirmIcon.svg'

function ConfirmButton({ onClick }) {

	return (

		<div className="confirm-btn" onClick={onClick}>
			<ConfirmIcon className="confirm-icon" /> Select
		</div>

	)

}
export default ConfirmButton