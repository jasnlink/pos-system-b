import React, { useState, useEffect } from 'react';

import './Welcome.css';

import Keypad from './Forms/Keypad'
import PasscodeDisplay from './Forms/PasscodeDisplay'

function Welcome({ setStep, passcode }) {
	
	const [passcodeInput, setPasscodeInput] = useState('')


	function handleKeypadInput(key) {

		let cacheInput = passcodeInput
		
		if(key >= 0 && key <= 9) {

			//we've reached max length and not pressing backspace or enter
			if(cacheInput.length === passcode.toString().length) {
				return
			}
			return setPasscodeInput(cacheInput+key)
		}
		if(key === 'del') {

			//nothing to delete if input is empty
			if (cacheInput.length === 0) {
				return
			}

			//input not empty, so delete 1 digit
			cacheInput = cacheInput.slice(0, -1)
			return setPasscodeInput(cacheInput)
		}
		if(key === 'enter') {
			//after pressing enter, check if passcodes match
			if(cacheInput === passcode.toString()) {
				setStep(10)
			}

			//passcodes don't match, show error and reset input
			setPasscodeInput('')
			setError(true)
			
		}

		return
		
	}

	//security pin mismatch error
	const [error, setError] = useState(false)
	useEffect(() => {
		//hide error after 1 second
		if(error === true) {
			const timeout = setTimeout(() => {setError(false)}, 1200)
		}

	}, [error])



	return (
		<>
			<div className="container-fluid py-4">
				<div className="row">
					<PasscodeDisplay 
						passcode={passcode} 
						passcodeInput={passcodeInput}
					/>
				</div>
				<div className="row d-flex justify-content-center">
					<div className="col-4 text-center">
						<p className={error ? "my-2 visible passcode-error" : "my-2 invisible"}><strong>Wrong Passcode</strong></p>
					</div>
				</div>
				<div className="row d-flex justify-content-center">
					<div className="col-4">
						<Keypad 
							handleKeypadInput={handleKeypadInput}
						/>
					</div>
				</div>
			</div>
		</>
	)


}

export default Welcome;