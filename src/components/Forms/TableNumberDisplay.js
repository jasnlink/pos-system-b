import React from 'react'

import './TableNumberDisplay.css'

function TableNumberDisplay({ tableInputDisplay }) {

	return (
		<>
			<div className="container-fluid w-75 mt-3 mb-5 table-display-main">
				<div className="row">
					<p className="h1 table-display">{tableInputDisplay}</p>
				</div>
			</div>
		</>
	)

}

export default TableNumberDisplay