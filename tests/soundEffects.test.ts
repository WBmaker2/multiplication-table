import { describe, it, expect, vi } from 'vitest';
import { getMuted, toggleMute, setMuted, playClickSound, playCorrectSound, playWrongSound } from '../src/utils/soundEffects';

describe('soundEffects', () => {
  it('toggles mute status correctly', () => {
    setMuted(false);
    expect(getMuted()).toBe(false);
    expect(toggleMute()).toBe(true);
    expect(getMuted()).toBe(true);
    expect(toggleMute()).toBe(false);
  });

  it('runs sound playback functions safely without throwing when AudioContext is mocked or absent', () => {
    expect(() => playClickSound()).not.toThrow();
    expect(() => playCorrectSound()).not.toThrow();
    expect(() => playWrongSound()).not.toThrow();
  });

  it('does not attempt playback when muted', () => {
    setMuted(true);
    expect(getMuted()).toBe(true);
    expect(() => playClickSound()).not.toThrow();
    expect(() => playCorrectSound()).not.toThrow();
    expect(() => playWrongSound()).not.toThrow();
  });

  it('plays sounds using AudioContext when available and resumes suspended context', () => {
    setMuted(false);
    const mockOscillator = {
      type: '',
      frequency: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
    const mockGain = {
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    };
    const mockAudioContext = {
      state: 'suspended',
      currentTime: 0,
      destination: {},
      createOscillator: vi.fn(() => ({ ...mockOscillator })),
      createGain: vi.fn(() => ({ ...mockGain })),
      resume: vi.fn(),
    };

    const originalAudioContext = window.AudioContext;
    (window as unknown as { AudioContext: unknown }).AudioContext = vi.fn(() => mockAudioContext);

    try {
      playClickSound();
      playCorrectSound();
      playWrongSound();
      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
      expect(mockAudioContext.createGain).toHaveBeenCalled();
    } finally {
      (window as unknown as { AudioContext: unknown }).AudioContext = originalAudioContext;
    }
  });
});
