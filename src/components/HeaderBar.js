import React, { useState } from 'react'

import './HeaderBar.css'


function HeaderBar({ date, time }) {

	return (

		<div className="container-fluid headerbar-main">
			<div className="headerbar-item">
				<p className="h4 time-display">LOGO HERE</p>
			</div>
			<div className="headerbar-item">
				<div className="headerbar-item-time">
					<div className="text-center">
						<p className="h4 time-display">{time}</p>
					</div>
					<div className="text-start">
						<p className="h4 date-display">{date}</p>
					</div>
				</div>
			</div>
			<div className="headerbar-item">
				
			</div>
		</div>

	)

}
export default HeaderBar