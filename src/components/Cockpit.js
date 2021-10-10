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
					<div className="card shadow border-0 rounded-3 mb-4">
						<div className="card-body">
							<div style={{ "height": "120px" }} class="d-flex justify-content-between">
								<h3 className="text-dark-50">Some text</h3>
								<h1 className="text-dark">100</h1>
							</div>
						</div>
					</div>
				</div>
				<div className="col-md-4">
					<div className="card shadow border-0 rounded-3 mb-4">
						<div className="card-body">
							<div style={{ "height": "120px" }} class="d-flex justify-content-between">
								<h3 className="text-dark-50">Some text</h3>
								<h1 className="text-dark">100</h1>
							</div>
						</div>
					</div>
				</div>
				<div className="col-md-4">
					<div className="card shadow border-0 rounded-3 mb-4">
						<div className="card-body">
							<div style={{ "height": "120px" }} class="d-flex justify-content-between">
								<h3 className="text-dark-50">Some text</h3>
								<h1 className="text-dark">100</h1>
							</div>
						</div>
					</div>
				</div>
				<div className="col-md-4">
					<div className="card shadow border-0 rounded-3 mb-4">
						<div className="card-body">
							<div style={{ "height": "120px" }} class="d-flex justify-content-between">
								<h3 className="text-dark-50">Some text</h3>
								<h1 className="text-dark">100</h1>
							</div>
						</div>
					</div>
				</div>
				<div className="col-md-4">
					<div className="card shadow border-0 rounded-3 mb-4">
						<div className="card-body">
							<div style={{ "height": "120px" }} class="d-flex justify-content-between">
								<h3 className="text-dark-50">Some text</h3>
								<h1 className="text-dark">100</h1>
							</div>
						</div>
					</div>
				</div>
				<div className="col-md-4">
					<div className="card shadow border-0 rounded-3 mb-4">
						<div className="card-body">
							<div style={{ "height": "120px" }} class="d-flex justify-content-between">
								<h3 className="text-dark-50">Some text</h3>
								<h1 className="text-dark">100</h1>
							</div>
						</div>
					</div>
				</div>
				<div className="col-md-4">
					<div className="card shadow border-0 rounded-3 mb-4">
						<div className="card-body">
							<div style={{ "height": "120px" }} class="d-flex justify-content-between">
								<h3 className="text-dark-50">Some text</h3>
								<h1 className="text-dark">100</h1>
							</div>
						</div>
					</div>
				</div>
				<div className="col-md-4">
					<div className="card shadow border-0 rounded-3 mb-4">
						<div className="card-body">
							<div style={{ "height": "120px" }} class="d-flex justify-content-between">
								<h3 className="text-dark-50">Some text</h3>
								<h1 className="text-dark">100</h1>
							</div>
						</div>
					</div>
				</div>
				<div className="col-md-4">
					<div className="card shadow border-0 rounded-3 mb-4">
						<div className="card-body">
							<div style={{ "height": "120px" }} class="d-flex justify-content-between">
								<h3 className="text-dark-50">Some text</h3>
								<h1 className="text-dark">100</h1>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Cockpit;
