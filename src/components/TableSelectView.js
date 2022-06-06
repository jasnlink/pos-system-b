import React from 'react'

import './TableSelectView.css'

import Keypad from './Forms/Keypad'

function TableSelectView() {

	return (

			<div className="container-fluid">
				<div className="row text-center">
					<div className="col-4 view-left">
						<h1 className="display-6 display-title">
							We in!
						</h1>
					</div>
					<div className="col-4 view-center">
						<h1 className="display-6 display-title">
							Table List
						</h1>
					</div>
					<div className="col-4 view-right">
						<h1 className="display-6 display-title">
							Table Number
						</h1>
						<Keypad />
					</div>
				</div>
			</div>

	)
}

export default TableSelectView