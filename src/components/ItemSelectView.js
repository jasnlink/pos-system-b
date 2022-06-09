import React from 'react'
import './ItemSelectView.css'


function ItemSelectView({ setStep, selectedTable, selectedClient, setSelectedClient }) {

	return (

		<div className="container-fluid clientview-main">
				<div className="row text-center">
					<div className="col-4 clientview-left p-0">
						<div className="row p-0 gx-0">
							<ul className="client-list">
								<h1 className="display-6 display-title">
									Table #{selectedTable.table_number} Client #{selectedClient.client_number}
								</h1>
							</ul>
						</div>
						<div className="row gx-0">
							<div className="client-panel">

							</div>
						</div>
					</div>
					<div className="col-4 clientview-center p-0">
						<div className="row p-0 gx-0">
							<ul className="client-list">
								
							</ul>
						</div>
						<div className="row gx-0">
							<div className="client-panel">
								
							</div>
						</div>
					</div>
					<div className="col-4 clientview-right p-0">
						<div className="row p-0 gx-0">
							<ul className="table-list">
								
							</ul>
						</div>
						<div className="row gx-0">
							<div className="client-panel">

							</div>
						</div>
					</div>
				</div>
			</div>

	)
}
export default ItemSelectView