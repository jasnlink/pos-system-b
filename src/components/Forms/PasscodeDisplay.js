import React, { useState } from 'react'

import './PasscodeDisplay.css'

function PasscodeDisplay({ passcode, passcodeInput }) {


	//renders a circle for each digit in the passcode
	function RenderDotArray() {

		let content = []

		//convert passcode to string to count length, then loop through it
		for (let i = 0; i < passcode.toString().length; i++) {

			//check if a passcode has been inputted
			//render a filled dot for each digit in input
			if (passcodeInput.length && i < passcodeInput.length) {
				content.push(
					<div className="col">
						<svg className="dot-icon" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
							<circle className="dot-filled" cx="18" cy="18" r="12"/>
						</svg>
					</div>
				)
			//render empty dot for remaining of passcode length
			} else {
				content.push(
					<div className="col">
						<svg className="dot-icon" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
							<circle className="dot" cx="18" cy="18" r="12"/>
						</svg>
					</div>
				)
			}
			
		}
		return content
	}

	return (

		<div className="container align-items-center px-4 w-25 text-center pb-0">
			<div className="row">
				<h1 className="display-6 display-title">
					Enter Passcode
				</h1>
			</div>
			<div className="row pt-4 pb-2">
				<RenderDotArray />
			</div>
		</div>

	)

}

export default PasscodeDisplay