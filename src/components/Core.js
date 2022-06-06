import React, { useState, useEffect } from 'react';

import Welcome from './Welcome';
import TableSelectView from './TableSelectView'
import HeaderBar from './HeaderBar'

function Core() {

	//keeps track of where we are in the app
	const [step, setStep] = useState(1);

	//keep track of current date
	const [date, setDate] = useState('')
	//keep track of current time
	const [time, setTime] = useState('')


	//need to clear this timer every function call
	//or there will be multiple timers going off each rerender
	let timer;

	//gets current time, then set a 1 sec timeout to get again
	function currentTime() {

		//cleanup timer on function call
		window.clearTimeout(timer)

		const today = new Date();

		let weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long'}).format(today)
		let date = today.getDate()
		let month = new Intl.DateTimeFormat('en-US', { month: 'long'}).format(today)
		let year = today.getFullYear()
		setDate(weekday + ", " + month + " " + date + ", " + year)

		let h = today.getHours();
		let m = today.getMinutes();
		let s = today.getSeconds();
		h = formatTime(h);
		m = formatTime(m);
		s = formatTime(s);

		const time = (
						<>
							<div className="hour">{h}</div>
							<div className="minute">{m}</div>
							<div className="second">{s}</div>
						</>
					)
		
		setTime(time)

		timer = setTimeout(currentTime, 1000);		

	}
	//format time
	function formatTime(i) {

		if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
		return i;
	}

	useEffect(() => {
		
		currentTime()

		//useEffect cleanup
		//need to cleanup timers or they perpetuate and stack
		return(()=>{
			window.clearTimeout(timer)
		})

	}, [])


	switch(step) {

		case 1:
		    return (
		    	<>
		    		<HeaderBar date={date} time={time} />
			    	<Welcome
						setStep={step => setStep(step)}
					/>
				</>
		      )

	   	case 2:
		    return (
		    	<>
		    		<HeaderBar date={date} time={time} />
			    	<TableSelectView
						setStep={step => setStep(step)}
					/>
				</>
		      )
	}

}

export default Core;