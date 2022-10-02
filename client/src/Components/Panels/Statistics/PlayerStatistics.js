import React from 'react'
import './PlayerStatistics.css'

const PlayerStatistics = props => {
	return (
    <>
        <p className='statistics-title'>Your statistics</p>
		<div className='statistics-content'>
			<div className='statistics-div'>
				<p className='statistics-label'>Games Played:</p>
				<p className='statistics-value'>8</p>
			</div>
            <div className='statistics-div'>
				<p className='statistics-label'>Time played:</p>
				<p className='statistics-value'>01:12:34</p>
			</div>
            <div className='statistics-div'>
				<p className='statistics-label'>Number of times as Traitor:</p>
				<p className='statistics-value'>3</p>
			</div>
            <div className='statistics-div'>
				<p className='statistics-label'>Number of wins as survivor:</p>
				<p className='statistics-value'>7</p>
			</div>
            <div className='statistics-div'>
				<p className='statistics-label'>Number of wins as Traitor:</p>
				<p className='statistics-value'>1</p>
			</div>
            <div className='statistics-div'>
				<p className='statistics-label'>Most played survivor:</p>
				<p className='statistics-value'>Father Rhinehardt</p>
			</div>
			<div className='statistics-div'>
				<p className='statistics-label'>Total times haunt revealer:</p>
				<p className='statistics-value'>2</p>
			</div>
			<div className='statistics-div'>
				<p className='statistics-label'>Total damage dealt to traitor:</p>
				<p className='statistics-value'>22654</p>
			</div>
			<div className='statistics-div'>
				<p className='statistics-label'>Total damage dealt to survivors:</p>
				<p className='statistics-value'>277846</p>
			</div>
		</div>
    </>

	)
}

export default PlayerStatistics