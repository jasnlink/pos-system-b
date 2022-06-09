import React from 'react'
import './BackButton.css'
import { ReactComponent as BackIcon } from './assets/backIcon.svg'

function BackButton({ onClick }) {

	return (

		<div className="back-btn" onClick={onClick}>
			<BackIcon className="back-icon" /> Back
		</div>

	)

}
export default BackButton