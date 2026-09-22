import React from 'react';
import { useHome } from '../context/HomeContext';
import { ChevronRight, Video, Sparkles, Maximize2 } from 'lucide-react';

export const CameraGrid = () => {
  const { cameras, setSelectedCamera } = useHome();

  return (
    <div className="cameras-section">
      <div className="dashboard-section-header">
        <h2 className="dashboard-section-title">
          <span>Cameras</span>
          <ChevronRight size={16} className="section-chevron" />
        </h2>
      </div>

      <div className="camera-grid">
        {cameras.map(cam => (
          <div
            key={cam.id}
            className="camera-card"
            onClick={() => setSelectedCamera(cam)}
            title={`View ${cam.name} live feed & local vision analysis`}
          >
            <img src={cam.image} alt={cam.name} className="camera-image" />

            {/* Top Overlay: Live badge and AI vision detection */}
            <div className="camera-overlay-top">
              <span className="camera-live-badge">
                <span className="live-dot"></span>
                LIVE
              </span>
              <span className="camera-ai-tag">
                <Sparkles size={11} />
                <span>{cam.aiTag}</span>
              </span>
            </div>

            {/* Bottom Overlay: Title, location, maximize hint */}
            <div className="camera-overlay-bottom">
              <div>
                <div className="camera-name">{cam.name}</div>
                <div className="camera-location">{cam.location}</div>
              </div>
              <button
                className="action-circle-btn"
                style={{ width: 28, height: 28, background: 'rgba(0,0,0,0.4)' }}
              >
                <Maximize2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
