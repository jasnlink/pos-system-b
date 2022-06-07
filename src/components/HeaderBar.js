import React, { useState } from 'react'

import './HeaderBar.css'


function HeaderBar({ date, time }) {

	return (

		<div className="container-fluid headerbar-main">
			<div className="row justify-content-center">
				<div className="col-2 text-center">
					<p className="h4 time-display">{time}</p>
				</div>
				<div className="col-3 text-start">
					<p className="h4 date-display">{date}</p>
				</div>
			</div>
		</div>

	)

}
export default HeaderBar