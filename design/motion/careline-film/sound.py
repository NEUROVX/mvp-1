"""Synthesised sound design for film.html, synced to its event times.

python3 sound.py out/events.json out/sound.wav   (needs numpy)
Everything is generated from sine waves and filtered noise: no samples, no licensing.
"""
import json, sys, wave
import numpy as np

SR, DUR = 48000, 15.6
ev = json.load(open(sys.argv[1]))
N = int(SR * DUR)
L, R = np.zeros(N), np.zeros(N)
t = np.arange(N) / SR

def hz(note):  # MIDI -> Hz
    return 440.0 * 2 ** ((note - 69) / 12)

def add(sig, start, gain=1.0, pan=0.0):
    i = int(start * SR)
    if i >= N: return
    sig = sig[: N - i] * gain
    L[i:i + len(sig)] += sig * np.sqrt((1 - pan) / 2)
    R[i:i + len(sig)] += sig * np.sqrt((1 + pan) / 2)

def env(n, a, d):  # attack seconds, exponential decay time constant
    x = np.arange(n) / SR
    return np.minimum(1, x / max(a, 1e-4)) * np.exp(-x / d)

def tone(freq, length, a=0.004, d=0.35, partials=((1, 1.0), (2, 0.18), (4.2, 0.06))):
    n = int(length * SR); x = np.arange(n) / SR
    s = sum(g * np.sin(2 * np.pi * freq * k * x) * np.exp(-x * k * 1.5) for k, g in partials)
    return s * env(n, a, d)

def lowpass(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR); y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x): acc = (1 - a) * v + a * acc; y[i] = acc
    return y

rng = np.random.default_rng(7)

# Pad: a quiet D major 9 bed that breathes, then opens on the mark.
pad = np.zeros(N)
for note, g in ((50, 0.5), (57, 0.45), (64, 0.3), (66, 0.28), (69, 0.2)):
    f = hz(note)
    pad += g * (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 1.003 * t))
swell = np.clip(t / 2.5, 0, 1) * (0.75 + 0.25 * np.sin(2 * np.pi * t / 7.5))
duck = 1 - 0.6 * np.clip((t - 12.3) / 0.4, 0, 1) * np.clip((13.3 - t) / 0.3 + 1, 0, 1)
fade = np.clip((DUR - t) / 1.4, 0, 1)
pad *= swell * duck * fade * 0.05
L += pad; R += pad

# Opening pluck as the dot appears.
add(tone(hz(74), 1.2, d=0.5), 0.12, 0.22)

# Whooshes: filtered noise rising into each big move.
for w in ev['whoosh']:
    n = int(0.7 * SR); x = np.arange(n) / SR
    shape = np.sin(np.pi * np.clip(x / 0.7, 0, 1)) ** 2
    nz = lowpass(rng.standard_normal(n), 900) * shape
    add(nz, w - 0.15, 0.2, pan=-0.3); add(lowpass(rng.standard_normal(n), 900) * shape, w - 0.15, 0.2, pan=0.3)

# Careline checkpoints: rising pentatonic marimba tones.
for i, tt in enumerate(ev['nodes']):
    add(tone(hz([74, 76, 78, 81][i]), 1.0, d=0.28), tt, 0.26, pan=-0.6 + 0.4 * i)

# Workspace updates: a light tick panned to its workspace (family left, clinician centre, lab right).
for (pi, _, _, tt) in ev['rows']:
    add(tone(hz([86, 90, 93][pi]), 0.35, a=0.001, d=0.06, partials=((1, 1), (2.7, 0.2))), tt, 0.14, pan=[-0.7, 0, 0.7][pi])
    add(tone(hz([62, 64, 67][pi]), 0.3, a=0.002, d=0.05, partials=((1, 1),)), tt, 0.1, pan=[-0.7, 0, 0.7][pi])

# Button press: a soft mechanical click.
click = lowpass(rng.standard_normal(int(0.03 * SR)), 3000) * env(int(0.03 * SR), 0.0005, 0.006)
add(click, ev['press'], 0.5); add(tone(160, 0.2, a=0.001, d=0.04, partials=((1, 1),)), ev['press'], 0.35)

# The mark: a warm bell chord and a low bloom.
for k, note in enumerate((62, 69, 73, 76, 81)):
    add(tone(hz(note), 2.6, a=0.003, d=1.1), ev['mark'] + 0.04 * k, 0.12, pan=-0.4 + 0.2 * k)
add(tone(hz(38), 2.2, a=0.02, d=0.7, partials=((1, 1), (2, 0.3))), ev['mark'], 0.35)

# Master: gentle saturation and normalise to -1 dBFS.
mix = np.stack([L, R], 1)
mix = np.tanh(mix * 1.2)
mix *= 10 ** (-1 / 20) / np.abs(mix).max()
with wave.open(sys.argv[2], 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR)
    f.writeframes((mix * 32767).astype('<i2').tobytes())
print('wrote', sys.argv[2])
