import React from 'react'

import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);


function CharacterStatsRadar(props) {

    const data = {
        labels: props.data.map(data => data.stat),
        datasets: [
            {
                label: 'Stat',
                data: props.data.map(data => data.value),
                backgroundColor: '#37a36e7a',
                borderColor: '#af8818',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: props.responsive ? true : false,
        maintainAspectRatio: false,
        scales: {
            r: {
                angleLines: { color: 'rgba(255,255,255,0.3)' },
                grid: { color: 'rgba(255,255,255,0.3)' },
                pointLabels: { color: '#d1d13d' },
                ticks: { color: '#d1d13d', backdropColor: 'transparent', stepSize: 1 },
                min: 0,
                max: 6
            }
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
    }

    return (
        props.responsive ?
            <Radar data={data} options={options} />
            :
            <Radar data={data} options={options} height={245} />
        )
}

export default CharacterStatsRadar