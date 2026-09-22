import React, { useState } from 'react';
import { useHome } from '../context/HomeContext';
import { X, Mic, Volume2, ShieldAlert, Camera, Sparkles, Activity, CheckCircle2 } from 'lucide-react';

export const CameraDetailModal = () => {
  const { selectedCamera, setSelectedCamera } = useHome();
  const [isTalking, setIsTalking] = useState(false);
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [snapshotTaken, setSnapshotTaken] = useState(false);

  if (!selectedCamera) return null;

  const handleTakeSnapshot = () => {
    setSnapshotTaken(true);
    setTimeout(() => setSnapshotTaken(false), 2500);
  };

  return (
    <div className="modal-backdrop" onClick={() => setSelectedCamera(null)}>
      <div
        className="ai-modal-container"
        style={{ maxWidth: 840 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="ai-modal-header">
          <div className="ai-modal-header-left">
            <div>
              <div className="ai-modal-header-title">{selectedCamera.name}</div>
              <div className="ai-modal-header-sub">
                {selectedCamera.location} • 4K HDR • 60 FPS • 100% On-Device Neural Vision
              </div>
            </div>
          </div>
          <button className="ai-modal-close-btn" onClick={() => setSelectedCamera(null)}>
            <X size={18} />
          </button>
        </div>

        {/* Video Canvas Container */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000' }}>
          <img
            src={selectedCamera.image}
            alt={selectedCamera.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* AI Detection Bounding Box Overlays */}
          {selectedCamera.id === 'porch' && (
            <div
              style={{
                position: 'absolute',
                bottom: '8%',
                left: '52%',
                width: '18%',
                height: '24%',
                border: '2px solid #10b981',
                borderRadius: 8,
                background: 'rgba(16, 185, 129, 0.15)',
                pointerEvents: 'none'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -24,
                  left: 0,
                  background: '#10b981',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: 4
                }}
              >
                PACKAGE (99%)
              </div>
            </div>
          )}

          {selectedCamera.id === 'driveway' && (
            <div
              style={{
                position: 'absolute',
                bottom: '22%',
                right: '4%',
                width: '26%',
                height: '42%',
                border: '2px solid #3b82f6',
                borderRadius: 8,
                background: 'rgba(59, 130, 246, 0.15)',
                pointerEvents: 'none'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -24,
                  left: 0,
                  background: '#3b82f6',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: 4
                }}
              >
                SUV SECURED (98%)
              </div>
            </div>
          )}

          {/* Live Badge & Timestamp overlay */}
          <div
            style={{
              position: 'absolute',
              top: 14,
              left: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <span className="camera-live-badge">
              <span className="live-dot" /> LIVE
            </span>
            <span
              style={{
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(10px)',
                padding: '3px 8px',
                borderRadius: 9999,
                fontSize: 11,
                fontWeight: 600,
                color: '#fff'
              }}
            >
              {new Date().toLocaleTimeString()}
            </span>
          </div>

          {snapshotTaken && (
            <div
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                background: '#10b981',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: 9999,
                fontSize: 12,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
              }}
            >
              <CheckCircle2 size={14} /> Snapshot saved to camera roll
            </div>
          )}
        </div>

        {/* Action Controls & AI Timeline */}
        <div style={{ padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              {/* Push-to-Talk */}
              <button
                className={`viewport-btn ${isTalking ? 'active' : ''}`}
                style={{
                  padding: '8px 16px',
                  background: isTalking ? '#ef4444' : 'rgba(255,255,255,0.12)',
                  fontSize: 13
                }}
                onClick={() => setIsTalking(!isTalking)}
              >
                <Mic size={16} />
                <span>{isTalking ? 'Speaking (Live)' : 'Push to Talk'}</span>
              </button>

              {/* Siren */}
              <button
                className="viewport-btn"
                style={{
                  padding: '8px 16px',
                  background: isSirenActive ? '#ef4444' : 'rgba(255,255,255,0.12)',
                  fontSize: 13
                }}
                onClick={() => setIsSirenActive(!isSirenActive)}
              >
                <ShieldAlert size={16} color={isSirenActive ? '#fff' : '#f87171'} />
                <span>{isSirenActive ? 'Siren Sounding' : 'Trigger Siren'}</span>
              </button>

              {/* Snapshot */}
              <button
                className="viewport-btn"
                style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.12)', fontSize: 13 }}
                onClick={handleTakeSnapshot}
              >
                <Camera size={16} />
                <span>Capture Snapshot</span>
              </button>
            </div>

            {/* Neural Vision Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#34d399', fontWeight: 600 }}>
              <Sparkles size={14} />
              <span>Voxelle Vision Neural Engine Active</span>
            </div>
          </div>

          {/* Recent Events Log */}
          <div style={{ background: 'rgba(0,0,0,0.25)', padding: 12, borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>
              Recent Neural Timeline
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {selectedCamera.recentEvents.map((evt, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'rgba(255,255,255,0.85)' }}>
                  <Activity size={12} color="#f59e0b" />
                  <span>{evt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
