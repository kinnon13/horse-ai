// template-sync/route.ts (45 lines) - GitHub→Supabase sync
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

async function fetchGitHubTemplates(repo: string, path: string, token: string) {
  const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
  })
  const files = await response.json()
  return Promise.all(files.filter((f: any) => f.name.endsWith('.md')).map(async (f: any) => {
    const contentResp = await fetch(f.download_url)
    return { name: f.name, content: await contentResp.text(), sha: f.sha }
  }))
}

async function syncToSupabase(templates: any[]) {
  for (const template of templates) {
    const templateName = template.name.replace('.md', '')
    await supabaseAdmin.from('prompt_templates').upsert({
      name: templateName, content: template.content, source: 'github', source_sha: template.sha,
      updated_at: new Date().toISOString()
    }, { onConflict: 'name' })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { repo, path, githubToken } = await req.json()
    if (!repo || !path) {
      return NextResponse.json({ error: 'repo and path required' }, { status: 400 })
    }
    const token = githubToken || process.env.GITHUB_TOKEN
    if (!token) {
      return NextResponse.json({ error: 'GitHub token required' }, { status: 400 })
    }
    const templates = await fetchGitHubTemplates(repo, path, token)
    await syncToSupabase(templates)
    return NextResponse.json({ success: true, synced: templates.length })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
