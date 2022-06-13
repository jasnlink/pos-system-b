import React, { useState } from 'react'

import './HeaderBar.css'


function HeaderBar({ date, time }) {

	return (

		<div className="container-fluid headerbar-main">
			<div className="headerbar-item">
				<p className="h4">LOGO HERE</p>
			</div>
			<div className="headerbar-item">
				<div className="headerbar-item-time">
					
						<p className="time-display text-monospace">{time}</p>
					
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