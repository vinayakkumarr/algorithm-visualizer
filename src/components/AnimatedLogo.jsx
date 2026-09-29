import React, { useState } from 'react';
import './AnimatedLogo.css';

export default function AnimatedLogo({ theme = 'light', maxWidth = '250px' }) {
  const [animationKey, setAnimationKey] = useState(0);

  const handleLogoClick = () => setAnimationKey((prev) => prev + 1);

  const isDark = theme === 'dark';
  const blockColor = isDark ? '#FFFFFF' : '#000000';
  const textStyle = {
    '--logo-text-color':    isDark ? '#FFFFFF' : '#000000',
    '--logo-subtext-color': isDark ? '#999999' : '#666666',
  };

  return (
    <div
      className="av-logo-container"
      onClick={handleLogoClick}
      style={textStyle}
      title="Click to replay"
    >
      <svg
        viewBox="0 0 900 120"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        style={{ maxWidth }}
      >
        {/* SVG mark — key prop re-mounts the group on every click, replaying all animations */}
        <g key={animationKey} className="av-svg-mark">
          <rect className="block-1" x="64" y="0"  width="56" height="56" fill={blockColor} />
          <rect className="block-2" x="64" y="64" width="56" height="56" fill={blockColor} />
          <rect className="block-3" x="0"  y="64" width="56" height="56" fill={blockColor} />
          <rect className="block-4" x="32" y="0"  width="24" height="24" fill={blockColor} />
          <rect className="block-5" x="32" y="32" width="24" height="24" fill={blockColor} />
          <rect className="block-6" x="0"  y="32" width="24" height="24" fill={blockColor} />
          <circle className="target-node" cx="12" cy="12" r="12" fill="var(--accent)" />
        </g>

        {/* Wordmark — y adjusted for Cormorant Garamond's lower baseline */}
        <text x="160" y="84" className="av-wordmark">
          <tspan className="av-bold">Algorithm</tspan>
          {' '}
          <tspan className="av-light">Visualizer</tspan>
        </text>
      </svg>
    </div>
  );
}
