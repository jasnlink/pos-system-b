import React, { useState, useEffect } from 'react';

import './Welcome.css';

import PasscodeKeypad from './Forms/PasscodeKeypad'
import PasscodeDisplay from './Forms/PasscodeDisplay'

function Welcome({ setStep }) {
	
	const [passcode, setPasscode] = useState(6969)
	const [passcodeInput, setPasscodeInput] = useState('')

	const [valid, setValid] = useState(false)

	useEffect(() => {

		if(valid === true) {
			setStep(10)
		}

	}, [valid])

	return (
		<>
			<div className="container-fluid py-4">
				<PasscodeDisplay 
					passcode={passcode} 
					passcodeInput={passcodeInput}
				/>
				<PasscodeKeypad 
					passcode={passcode} 
					passcodeInput={passcodeInput} 
					setPasscodeInput={(pass) => setPasscodeInput(pass)} 
					setValid={(valid) => setValid(valid)}
				/>
			</div>
		</>
	)


}

export default Welcome;