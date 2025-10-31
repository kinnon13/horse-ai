'use client'
import { Button } from './ui/Button'
import { supabase } from '@/lib/supabase'

interface ShareButtonProps {
  conversationSnippet: string
  conversationId?: string
  userId?: string
  screenshotElement?: HTMLElement | null
}

export function ShareButton({ conversationSnippet, conversationId, userId, screenshotElement }: ShareButtonProps) {
  const trackShare = async (platform: string) => {
    if (!userId) return
    await supabase.rpc('increment_share_count', { user_id: userId })
    await supabase.from('engagement_metrics').upsert({
      user_id: userId, share_count: 1, measured_at: new Date().toISOString()
    }, { onConflict: 'user_id' })
  }
  const shareText = `HorseGPT said "${conversationSnippet.substring(0, 100)}...". Check this out!`
  const shareUrl = `${window.location.origin}/chat${conversationId ? `?id=${conversationId}` : ''}`
  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
    trackShare('copy')
  }
  const handleScreenshot = async () => {
    if (!screenshotElement) return
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(screenshotElement)
    canvas.toBlob((blob) => blob && navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]))
    trackShare('screenshot')
  }
  const handleSocialShare = (platform: string) => {
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      instagram: shareUrl
    }
    window.open(urls[platform], '_blank')
    trackShare(platform)
  }
  return (
    <div className="flex gap-2">
      <Button size="sm" onClick={handleCopyLink}>Copy Link</Button>
      <Button size="sm" onClick={handleScreenshot}>Screenshot</Button>
      <Button size="sm" onClick={() => handleSocialShare('twitter')}>Twitter</Button>
      <Button size="sm" onClick={() => handleSocialShare('facebook')}>Facebook</Button>
      <Button size="sm" onClick={() => handleSocialShare('instagram')}>Instagram</Button>
    </div>
  )
}