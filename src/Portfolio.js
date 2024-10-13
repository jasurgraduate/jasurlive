import React from 'react';

function Portfolio() {
    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            {/* Iframe that loads the external website */}
            <iframe
                src="https://jasurcv.blogspot.com/" // Replace with your target URL
                title="Portfolio"
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                }}
                loading="lazy"
            ></iframe>

            {/* Navigation menu */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                padding: '10px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
            }}>
                <ul className="menu" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    <li><a href="/">&#127969; HOME</a></li>
                    <li><a href="/resume">&#128373; RESUME</a></li>
                    <li><a href="https://jasurcv.blogspot.com/">&#128092; PORTFOLIO</a></li>
                    <li><a href="/awards">&#127891; AWARDS</a></li>
                    <li><a href="https://jasurgraduate.blogspot.com/">&#x1F334; BLOGS</a></li>
                </ul>
            </div>
        </div>
    );
}

export default Portfolio;
