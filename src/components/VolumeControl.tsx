import React, { useState } from 'react'

interface VolumeControlProps {
  onVolumeChange: (volume: number) => Promise<void>
}

const VolumeControl: React.FC<VolumeControlProps> = ({ onVolumeChange }) => {
  const [volume, setVolume] = useState<number>(0.8)

  const handleVolumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    await onVolumeChange(newVolume)
  }

  return (
    <div className="volume-control">
      <label htmlFor="volume">
        Volume: <span className="volume-value">{Math.round(volume * 100)}%</span>
      </label>
      <input
        id="volume"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        className="volume-slider"
      />
    </div>
  )
}

export default VolumeControl 