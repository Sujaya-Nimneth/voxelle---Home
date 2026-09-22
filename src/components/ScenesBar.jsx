import React from 'react';
import { useHome } from '../context/HomeContext';
import { SunMedium, Sunrise, DoorClosed, Film, Moon, Zap, Sparkles, ChevronRight } from 'lucide-react';

const SCENE_ICONS = {
  SunMedium: SunMedium,
  Sunrise: Sunrise,
  DoorClosed: DoorClosed,
  Film: Film,
  Moon: Moon,
  Zap: Zap
};

export const ScenesBar = () => {
  const { scenes, triggerScene } = useHome();

  return (
    <div className="scenes-section">
      <div className="dashboard-section-header">
        <h2 className="dashboard-section-title">
          <span>Scenes</span>
          <ChevronRight size={16} className="section-chevron" />
        </h2>
      </div>

      <div className="scenes-scroll-row">
        {scenes.map(scene => {
          const IconComponent = SCENE_ICONS[scene.icon] || Sparkles;
          return (
            <button
              key={scene.id}
              className={`scene-tile ${scene.isActive ? 'active' : ''}`}
              onClick={() => triggerScene(scene.id)}
            >
              <div className="scene-icon-bubble">
                <IconComponent size={18} />
              </div>
              <span className="scene-tile-label">{scene.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
