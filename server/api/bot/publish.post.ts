import { H3Event } from 'h3'
import { Octokit } from '@octokit/rest'

function getBearerToken(event: H3Event) {
  const authorization = getHeader(event, 'authorization')
  const match = authorization?.match(/^Bearer\s+(.+)$/i)
  return match?.[1]
}

function normalizeLabels(labels: unknown) {
  if (labels === undefined) return []
  if (!Array.isArray(labels) || labels.some(label => typeof label !== 'string')) {
    throw createError({ statusCode: 400, statusMessage: 'Labels must be an array of strings' })
  }
  return labels
}

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig()
  const botApiToken = config.private.botApiToken
  const requestToken = getBearerToken(event)

  if (!botApiToken) {
    throw createError({ statusCode: 500, statusMessage: 'Bot publishing is not configured' })
  }

  if (!requestToken || requestToken !== botApiToken) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid bot token' })
  }

  const body = await readBody(event)
  const { title, content, labels } = body || {}

  if (typeof title !== 'string' || !title.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Title is required' })
  }

  if (typeof content !== 'string' || !content.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Content is required' })
  }

  const githubToken = config.private.githubToken
  if (!githubToken) {
    throw createError({ statusCode: 500, statusMessage: 'GitHub token not configured on server' })
  }

  const repoOwner = config.public.repoOwner
  const repoName = config.public.repoName
  const siteUrl = config.public.siteUrl
  const normalizedLabels = normalizeLabels(labels)
  const octokit = new Octokit({ auth: githubToken })

  try {
    const { data: issue } = await octokit.issues.create({
      owner: repoOwner,
      repo: repoName,
      title: title.trim(),
      body: content,
      labels: normalizedLabels
    })

    return {
      success: true,
      issue: {
        number: issue.number,
        title: issue.title,
        html_url: issue.html_url,
        created_at: issue.created_at,
        site_url: `${siteUrl}/repo/${repoOwner}/${repoName}/blog/${issue.number}`
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.status || error.statusCode || 500,
      statusMessage: error.message || 'Failed to create issue on GitHub'
    })
  }
})
