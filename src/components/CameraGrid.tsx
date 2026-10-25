import { memo } from 'react';
import { useHome } from '../context/HomeContext';
import { ChevronRight, Sparkles, Maximize2 } from 'lucide-react';
import type { Camera } from '../types';

/** Memoized: a card re-renders only when its camera object changes. */
const CameraCard = memo(function CameraCard({
  camera,
  onOpen
}: {
  camera: Camera;
  onOpen: (camera: Camera) => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open ${camera.name} camera feed, ${camera.location}. Simulated demo feed.`}
      className="camera-card"
      onClick={() => onOpen(camera)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(camera);
        }
      }}
    >
      <img
        src={camera.image}
        alt={`${camera.name} still frame`}
        className="camera-image"
        width={1376}
        height={768}
        loading="lazy"
        decoding="async"
      />

      {/* Top Overlay: Live badge and AI vision detection */}
      <div className="camera-overlay-top">
        <span className="camera-live-badge">
          <span className="live-dot" aria-hidden="true"></span>
          DEMO
        </span>
        <span className="camera-ai-tag">
          <Sparkles size={11} />
          <span>{camera.aiTag}</span>
        </span>
      </div>

      {/* Bottom Overlay: Title, location, maximize hint */}
      <div className="camera-overlay-bottom">
        <div>
          <div className="camera-name">{camera.name}</div>
          <div className="camera-location">{camera.location}</div>
        </div>
        <button
          className="action-circle-btn"
          style={{ width: 28, height: 28, background: 'rgba(0,0,0,0.4)' }}
          aria-label={`Open ${camera.name}`}
          onClick={(e) => {
            e.stopPropagation();
            onOpen(camera);
          }}
        >
          <Maximize2 size={13} />
        </button>
      </div>
    </div>
  );
});

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
        {cameras.map((cam) => (
          <CameraCard key={cam.id} camera={cam} onOpen={setSelectedCamera} />
        ))}
      </div>
    </div>
  );
};
