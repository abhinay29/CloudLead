// eslint-disable-next-line
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router';

const Cockpit = () => {

	// eslint-disable-next-line
	let history = useHistory();

	useEffect(() => {
		if (!localStorage.getItem('token')) {
			history.push("/login")
		}
		// eslint-disable-next-line
	}, [])

	return (
		<div>
			<h2>Cockpit</h2>
		</div>
	)
}

export default Cockpit;
