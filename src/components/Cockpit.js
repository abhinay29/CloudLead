// eslint-disable-next-line
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router';

const Cockpit = () => {

	let history = useHistory();

	useEffect(() => {
		if (!localStorage.getItem('token')) {
			history.push("/login")
		}
		// eslint-disable-next-line
	}, [])

	return (
		<div className="container mt-4">
			<div className="row">
				<div className="col-md-4">
					<div className="card shadow-none rounded-3 mb-4">
						<div className="card-body">
							<div style={{ "height": "160px" }}>
								<h5 className="text-dark-50 mb-5">Contact Unlocked</h5>
								<h1 className="text-dark">114</h1>
							</div>
						</div>
					</div>
				</div>

				<div className="col-md-4">
					<div className="card shadow-none rounded-3 mb-4">
						<div className="card-body">
							<div style={{ "height": "160px" }}>
								<h5 className="text-dark-50 mb-5">Contact Download</h5>
								<h1 className="text-dark">20</h1>
							</div>
						</div>
					</div>
				</div>

				<div className="col-md-4">
					<div className="card shadow-none rounded-3 mb-4">
						<div className="card-body">
							<div style={{ "height": "160px" }}>
								<h5 className="text-dark-50 mb-5">Total Email Sent</h5>
								<h1 className="text-dark">50</h1>
							</div>
						</div>
					</div>
				</div>

				<div className="col-md-4">
					<div className="card shadow-none rounded-3 mb-4">
						<div className="card-body">
							<div style={{ "height": "160px" }}>
								<h5 className="text-dark-50 mb-5">Avg Unique Open Rate</h5>
								<h1 className="text-dark">60%</h1>
							</div>
						</div>
					</div>
				</div>

				<div className="col-md-4">
					<div className="card shadow-none rounded-3 mb-4">
						<div className="card-body">
							<div style={{ "height": "160px" }}>
								<h5 className="text-dark-50 mb-5">Avg Unique Link Click Rate</h5>
								<h1 className="text-dark">45%</h1>
							</div>
						</div>
					</div>
				</div>

				<div className="col-md-4">
					<div className="card shadow-none rounded-3 mb-4">
						<div className="card-body">
							<div style={{ "height": "160px" }}>
								<h5 className="text-dark-50 mb-5">Avg Reply Rate</h5>
								<h1 className="text-dark">35%</h1>
							</div>
						</div>
					</div>
				</div>

			</div>
		</div>
	)
}

export default Cockpit;
