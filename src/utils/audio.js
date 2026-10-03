let audioCtx = null

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

export function playCompletionSound() {
  const ctx = getCtx()
  const now = ctx.currentTime

  const frequencies = [523.25, 659.25, 783.99, 1046.5]
  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0, now + i * 0.15)
    gain.gain.linearRampToValueAtTime(0.15, now + i * 0.15 + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.8)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now + i * 0.15)
    osc.stop(now + i * 0.15 + 0.8)
  })
}

export function playTickSound() {
  const ctx = getCtx()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = 800
  gain.gain.setValueAtTime(0.05, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.05)
}

class AmbientGenerator {
  constructor() {
    this.nodes = []
    this.ctx = null
    this.gainNode = null
  }

  stop() {
    this.nodes.forEach((n) => {
      try { n.stop?.() } catch {}
      try { n.disconnect() } catch {}
    })
    this.nodes = []
    if (this.gainNode) {
      this.gainNode.disconnect()
      this.gainNode = null
    }
  }

  setVolume(v) {
    if (this.gainNode) this.gainNode.gain.value = v
  }

  _createNoise(ctx) {
    const bufferSize = ctx.sampleRate * 2
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true
    return source
  }
}

export class RainSound extends AmbientGenerator {
  start(volume = 0.3) {
    this.ctx = getCtx()
    this.gainNode = this.ctx.createGain()
    this.gainNode.gain.value = volume
    this.gainNode.connect(this.ctx.destination)

    const noise = this._createNoise(this.ctx)
    const hp = this.ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 400
    const lp = this.ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 8000

    noise.connect(hp)
    hp.connect(lp)
    lp.connect(this.gainNode)
    noise.start()
    this.nodes.push(noise, hp, lp)
  }
}

export class OceanSound extends AmbientGenerator {
  start(volume = 0.3) {
    this.ctx = getCtx()
    this.gainNode = this.ctx.createGain()
    this.gainNode.gain.value = volume
    this.gainNode.connect(this.ctx.destination)

    const noise = this._createNoise(this.ctx)
    const lp = this.ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 500
    const lfo = this.ctx.createOscillator()
    lfo.frequency.value = 0.1
    const lfoGain = this.ctx.createGain()
    lfoGain.gain.value = 200
    lfo.connect(lfoGain)
    lfoGain.connect(lp.frequency)

    noise.connect(lp)
    lp.connect(this.gainNode)
    noise.start()
    lfo.start()
    this.nodes.push(noise, lp, lfo, lfoGain)
  }
}

export class ForestSound extends AmbientGenerator {
  start(volume = 0.3) {
    this.ctx = getCtx()
    this.gainNode = this.ctx.createGain()
    this.gainNode.gain.value = volume
    this.gainNode.connect(this.ctx.destination)

    const noise = this._createNoise(this.ctx)
    const bp = this.ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 2000
    bp.Q.value = 0.5
    const g = this.ctx.createGain()
    g.gain.value = 0.4

    noise.connect(bp)
    bp.connect(g)
    g.connect(this.gainNode)
    noise.start()
    this.nodes.push(noise, bp, g)

    this._chirpInterval = setInterval(() => {
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gn = this.ctx.createGain()
      const freq = 2000 + Math.random() * 3000
      osc.type = 'sine'
      osc.frequency.value = freq
      osc.frequency.linearRampToValueAtTime(freq * 1.2, this.ctx.currentTime + 0.1)
      gn.gain.setValueAtTime(0, this.ctx.currentTime)
      gn.gain.linearRampToValueAtTime(0.06 * volume, this.ctx.currentTime + 0.02)
      gn.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15)
      osc.connect(gn)
      gn.connect(this.gainNode)
      osc.start()
      osc.stop(this.ctx.currentTime + 0.15)
    }, 2000 + Math.random() * 4000)
  }

  stop() {
    clearInterval(this._chirpInterval)
    super.stop()
  }
}

export class CoffeeShopSound extends AmbientGenerator {
  start(volume = 0.3) {
    this.ctx = getCtx()
    this.gainNode = this.ctx.createGain()
    this.gainNode.gain.value = volume
    this.gainNode.connect(this.ctx.destination)

    const noise = this._createNoise(this.ctx)
    const lp = this.ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 1200
    const g = this.ctx.createGain()
    g.gain.value = 0.5

    noise.connect(lp)
    lp.connect(g)
    g.connect(this.gainNode)
    noise.start()
    this.nodes.push(noise, lp, g)
  }
}

export class FireplaceSound extends AmbientGenerator {
  start(volume = 0.3) {
    this.ctx = getCtx()
    this.gainNode = this.ctx.createGain()
    this.gainNode.gain.value = volume
    this.gainNode.connect(this.ctx.destination)

    const noise = this._createNoise(this.ctx)
    const bp = this.ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 800
    bp.Q.value = 1

    noise.connect(bp)
    bp.connect(this.gainNode)
    noise.start()
    this.nodes.push(noise, bp)

    this._crackleInterval = setInterval(() => {
      if (!this.ctx) return
      const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.02, this.ctx.sampleRate)
      const d = buf.getChannelData(0)
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.random()
      const src = this.ctx.createBufferSource()
      src.buffer = buf
      const gn = this.ctx.createGain()
      gn.gain.setValueAtTime(0.15 * volume, this.ctx.currentTime)
      gn.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05)
      src.connect(gn)
      gn.connect(this.gainNode)
      src.start()
    }, 100 + Math.random() * 300)
  }

  stop() {
    clearInterval(this._crackleInterval)
    super.stop()
  }
}

export class WhiteNoiseSound extends AmbientGenerator {
  start(volume = 0.3) {
    this.ctx = getCtx()
    this.gainNode = this.ctx.createGain()
    this.gainNode.gain.value = volume
    this.gainNode.connect(this.ctx.destination)

    const noise = this._createNoise(this.ctx)
    noise.connect(this.gainNode)
    noise.start()
    this.nodes.push(noise)
  }
}

export const AMBIENT_SOUNDS = [
  { id: 'rain', label: 'Rain', icon: '🌧', Generator: RainSound },
  { id: 'ocean', label: 'Ocean', icon: '🌊', Generator: OceanSound },
  { id: 'forest', label: 'Forest', icon: '🌲', Generator: ForestSound },
  { id: 'coffee', label: 'Coffee Shop', icon: '☕', Generator: CoffeeShopSound },
  { id: 'fireplace', label: 'Fireplace', icon: '🔥', Generator: FireplaceSound },
  { id: 'whitenoise', label: 'White Noise', icon: '📻', Generator: WhiteNoiseSound },
]
