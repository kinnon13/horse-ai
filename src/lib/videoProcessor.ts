import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import path from 'path'

export async function extractFrames(
  videoUrl: string,
  intervalSeconds = 5,
  maxFrames = 10
): Promise<string[]> {
  const outputDir = `/tmp/frames-${Date.now()}`
  fs.mkdirSync(outputDir, { recursive: true })
  return new Promise((resolve, reject) => {
    const timestamps = Array.from({ length: maxFrames }, (_, i) => i * intervalSeconds)
    ffmpeg(videoUrl)
      .screenshots({ timestamps, folder: outputDir, filename: 'frame-%i.png', size: '640x?' })
      .on('end', () => {
        const frames = fs.readdirSync(outputDir)
          .filter((f) => f.endsWith('.png'))
          .map((f) => {
            const data = fs.readFileSync(path.join(outputDir, f))
            return `data:image/png;base64,${data.toString('base64')}`
          })
        fs.rmSync(outputDir, { recursive: true })
        resolve(frames)
      })
      .on('error', (err) => {
        fs.rmSync(outputDir, { recursive: true, force: true })
        reject(err)
      })
  })
}

export async function extractAudio(videoUrl: string): Promise<string> {
  const outputPath = `/tmp/audio-${Date.now()}.mp3`
  return new Promise((resolve, reject) => {
    ffmpeg(videoUrl)
      .output(outputPath)
      .noVideo()
      .audioCodec('libmp3lame')
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .run()
  })
}
