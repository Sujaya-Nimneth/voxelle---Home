import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer
} from 'react';
import confetti from 'canvas-confetti';
import type {
  Automation,
  Camera,
  Device,
  DeviceCategory,
  DeviceFrame,
  DeviceUpdates,
  Scene,
  ViewId,
  Wallpaper
} from '../types';
import {
  createInitialHomeState,
  homeReducer
} from '../store/homeReducer';
import {
  clearPersistedState,
  loadPersistedState,
  savePersistedState
} from '../store/persistence';

export interface HomeContextValue {
  devices: Device[];
  scenes: Scene[];
  cameras: Camera[];
  automations: Automation[];
  activeCategory: DeviceCategory | null;
  setActiveCategory: (category: DeviceCategory | null) => void;
  activeRoom: string;
  setActiveRoom: (room: string) => void;
  activeNav: ViewId;
  setActiveNav: (nav: ViewId) => void;
  deviceFrame: DeviceFrame;
  setDeviceFrame: (frame: DeviceFrame) => void;
  wallpaper: Wallpaper;
  setWallpaper: (wallpaper: Wallpaper) => void;
  selectedDevice: Device | null;
  setSelectedDevice: (device: Device | null) => void;
  selectedCamera: Camera | null;
  setSelectedCamera: (camera: Camera | null) => void;
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  toggleDevice: (id: string) => void;
  updateDevice: (id: string, updates: DeviceUpdates) => void;
  triggerScene: (sceneId: string) => void;
  addAutomation: (automation: Automation) => void;
  toggleAutomation: (id: string) => void;
  resetHome: () => void;
  activeLightsCount: number;
  unlockedDoorsCount: number;
  playingSpeakersCount: number;
  waterStatus: string;
  climateSummary: string;
  automationCount: number;
}

const HomeContext = createContext<HomeContextValue | null>(null);

export const HomeProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(homeReducer, undefined, () => {
    const persisted = loadPersistedState();
    return persisted ? { ...createInitialHomeState(), ...persisted } : createInitialHomeState();
  });

  // Persist the user-mutable slices whenever they change.
  useEffect(() => {
    savePersistedState({
      version: 1,
      devices: state.devices,
      scenes: state.scenes,
      automations: state.automations
    });
  }, [state.devices, state.scenes, state.automations]);

  const toggleDevice = useCallback((id: string) => dispatch({ type: 'TOGGLE_DEVICE', id }), []);
  const updateDevice = useCallback(
    (id: string, updates: DeviceUpdates) => dispatch({ type: 'UPDATE_DEVICE', id, updates }),
    []
  );
  const triggerScene = useCallback((sceneId: string) => {
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#f59e0b', '#fbbf24', '#06b6d4', '#10b981']
    });
    dispatch({ type: 'APPLY_SCENE', sceneId });
  }, []);
  const addAutomation = useCallback(
    (automation: Automation) => dispatch({ type: 'ADD_AUTOMATION', automation }),
    []
  );
  const toggleAutomation = useCallback(
    (id: string) => dispatch({ type: 'TOGGLE_AUTOMATION', id }),
    []
  );
  const resetHome = useCallback(() => {
    clearPersistedState();
    dispatch({ type: 'RESET_HOME' });
  }, []);
  const setActiveCategory = useCallback(
    (category: DeviceCategory | null) => dispatch({ type: 'SET_ACTIVE_CATEGORY', category }),
    []
  );
  const setActiveRoom = useCallback((room: string) => dispatch({ type: 'SET_ACTIVE_ROOM', room }), []);
  const setActiveNav = useCallback((nav: ViewId) => dispatch({ type: 'SET_ACTIVE_NAV', nav }), []);
  const setDeviceFrame = useCallback(
    (frame: DeviceFrame) => dispatch({ type: 'SET_DEVICE_FRAME', frame }),
    []
  );
  const setWallpaper = useCallback(
    (wallpaper: Wallpaper) => dispatch({ type: 'SET_WALLPAPER', wallpaper }),
    []
  );
  const setSelectedDevice = useCallback(
    (device: Device | null) => dispatch({ type: 'SELECT_DEVICE', device }),
    []
  );
  const setSelectedCamera = useCallback(
    (camera: Camera | null) => dispatch({ type: 'SELECT_CAMERA', camera }),
    []
  );
  const setIsAiModalOpen = useCallback(
    (open: boolean) => dispatch({ type: 'SET_AI_MODAL_OPEN', open }),
    []
  );

  const value = useMemo<HomeContextValue>(() => {
    const thermostats = state.devices.filter(d => d.type === 'thermostat');
    const targets = thermostats.map(t => t.targetTemp ?? t.value);
    const climateSummary = targets.length > 0
      ? `${Math.min(...targets)}° - ${Math.max(...targets)}°`
      : '—';

    return {
      ...state,
      toggleDevice,
      updateDevice,
      triggerScene,
      addAutomation,
      toggleAutomation,
      resetHome,
      setActiveCategory,
      setActiveRoom,
      setActiveNav,
      setDeviceFrame,
      setWallpaper,
      setSelectedDevice,
      setSelectedCamera,
      setIsAiModalOpen,
      activeLightsCount: state.devices.filter(d => d.category === 'lights' && d.isOn).length,
      unlockedDoorsCount: state.devices.filter(d => d.category === 'security' && !d.isOn).length,
      playingSpeakersCount: state.devices.filter(d => d.category === 'speakers' && d.isOn).length,
      waterStatus: state.devices.some(d => d.category === 'water' && d.isOn) ? 'Active' : 'All Off',
      climateSummary,
      automationCount: state.automations.length
    };
  }, [
    state,
    toggleDevice,
    updateDevice,
    triggerScene,
    addAutomation,
    toggleAutomation,
    resetHome,
    setActiveCategory,
    setActiveRoom,
    setActiveNav,
    setDeviceFrame,
    setWallpaper,
    setSelectedDevice,
    setSelectedCamera,
    setIsAiModalOpen
  ]);

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
};

export const useHome = (): HomeContextValue => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHome must be used within a HomeProvider');
  }
  return context;
};
