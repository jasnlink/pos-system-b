import React, { useState, useEffect } from 'react'

import './Keypad.css'

const backspaceIcon = (<svg className="backspace-icon" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" version="1.1" x="0px" y="0px"><g fill-rule="evenodd"><g><path d="M36.8757639,33.1242361 C38.0489471,31.9510529 40.3524401,31 41.9976599,31 L74.0023401,31 C75.657902,31 77,32.3524401 77,33.9976599 L77,66.0023401 C77,67.657902 75.6475599,69 74.0023401,69 L41.9976599,69 C40.342098,69 38.0447661,68.0447661 36.8757639,66.8757639 L22.1242361,52.1242361 C20.9510529,50.9510529 20.9552339,49.0447661 22.1242361,47.8757639 L36.8757639,33.1242361 Z M54.8181158,51.0605639 L47.9999037,57.878776 C47.4199576,58.4587221 47.4142136,59.4142136 48,60 C48.5898704,60.5898704 49.5354908,60.5858296 50.121224,60.0000963 L56.9394361,53.1818842 C57.5193823,52.6019381 58.4748306,52.596151 59.0605639,53.1818842 L65.878776,60.0000963 C66.4587221,60.5800424 67.4142136,60.5857864 68,60 C68.5898704,59.4101296 68.5858296,58.4645092 68.0000963,57.878776 L61.1818842,51.0605639 C60.6019381,50.4806177 60.596151,49.5251694 61.1818842,48.9394361 L68.0000963,42.121224 C68.5800424,41.5412779 68.5857864,40.5857864 68,40 C67.4101296,39.4101296 66.4645092,39.4141704 65.878776,39.9999037 L59.0605639,46.8181158 C58.4806177,47.3980619 57.5251694,47.403849 56.9394361,46.8181158 L50.121224,39.9999037 C49.5412779,39.4199576 48.5857864,39.4142136 48,40 C47.4101296,40.5898704 47.4141704,41.5354908 47.9999037,42.121224 L54.8181158,48.9394361 C55.3980619,49.5193823 55.403849,50.4748306 54.8181158,51.0605639 Z"></path></g></g></svg>)
const enterIcon = (<svg className="enter-icon" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 100 100" x="0px" y="0px"><path d="M70.3,53.1l-7.1,7.1A2.7,2.7,0,1,0,67,64.1L79,52.2a2.7,2.7,0,0,0,0-3.9L67.3,36.6a2.7,2.7,0,0,0-3.9,3.9l7.1,7.1H26.4V38.6a2.7,2.7,0,0,0-5.4,0V50.4a2.7,2.7,0,0,0,2.7,2.7H70.3Z"></path></svg>)


function Keypad({  }) {



	function handleKeypadInput(key) {

		return
		
	}


	return (

		<div className="container-fluid align-items-center text-center pt-2">
			<div className="row">
				<div className="col">
					<div className="keypad-btn" onClick={() => handleKeypadInput(1)}>
						1
					</div>
				</div>
				<div className="col">
					<div className="keypad-btn" onClick={() => handleKeypadInput(2)}>
						2
					</div>
				</div>
				<div className="col">
					<div className="keypad-btn" onClick={() => handleKeypadInput(3)}>
						3
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col">
					<div className="keypad-btn" onClick={() => handleKeypadInput(4)}>
						4
					</div>
				</div>
				<div className="col">
					<div className="keypad-btn" onClick={() => handleKeypadInput(5)}>
						5
					</div>
				</div>
				<div className="col">
					<div className="keypad-btn" onClick={() => handleKeypadInput(6)}>
						6
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col">
					<div className="keypad-btn" onClick={() => handleKeypadInput(7)}>
						7
					</div>
				</div>
				<div className="col">
					<div className="keypad-btn" onClick={() => handleKeypadInput(8)}>
						8
					</div>
				</div>
				<div className="col">
					<div className="keypad-btn" onClick={() => handleKeypadInput(9)}>
						9
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col">
					<div className="keypad-btn" onClick={() => handleKeypadInput('del')}>
						{backspaceIcon}
					</div>
				</div>
				<div className="col">
					<div className="keypad-btn" onClick={() => handleKeypadInput(0)}>
						0
					</div>
				</div>
				<div className="col">
					<div className="keypad-btn" onClick={() => handleKeypadInput('enter')}>
						{enterIcon}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Keypad