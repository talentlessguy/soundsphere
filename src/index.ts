if (typeof fetch === 'undefined') {
  if (typeof require === 'undefined') {
    /**
     * Load Node.js polyfill if running in Node
     */
    const mod = (async () => await import('node-fetch'))()
    // @ts-ignore
    globalThis.fetch = mod.default
  } else {
    globalThis.fetch = require('node-fetch')
  }
}

/* Interfaces */

export interface SoundCloudInit {
  id: string
  secret?: string
  user?: string | number
}

export interface Entity {
  id: number
  kind: string
}

export interface User extends Entity {
  permalink: string
  username: string
  last_modified: string
  uri: string
  permalink_url: string
  avatar_url: string
  country: string | null
  first_name: string
  last_name: string
  full_name: string
  description: string
  city: string | null
  discogs_name: string | null
  myspace_name: string | null
  website: string | null
  website_title: string | null
  track_count: number
  playlist_count: number
  online: boolean
  plan: string
  public_favorites_count: number
  followers_count: number
  followings_count: number
  subscriptions: any[]
  reposts_count: number
}

export interface Track extends Entity {
  created_at: string
  user_id: number
  duration: number
  commentable: boolean
  comment_count: number
  state: string
  original_content_size: number
  last_modified: string
  sharing: string
  tag_list: string
  permalink: string
  streamable: boolean
  embeddable_by: string
  purchase_url: null | string
  purchase_title: null | string
  label_id: null | string
  genre: string
  title: string
  description: null | string
  label_name: string
  release: null | string
  track_type: null | string
  key_signature: null | string
  isrc: null | string
  video_url: null | string
  bpm: null | string
  release_year: number
  release_month: number
  release_day: number
  original_format: string
  license: string
  uri: string
  user: User
  user_uri: string
  permalink_url: string
  artwork_url: string
  stream_url: string
  download_url: string
  waveform_url: string
  domain_lockings: null | string
  available_country_codes: null | string
  label: null | string
  secret_token: null | string
  secret_uri: null | string
  user_favorite: null | string
  user_playback_count: null | string
  playback_count: number
  download_count: number
  favoritings_count: number
  reposts_count: number
  downloadable: boolean
  downloads_remaining: null | string
}

export interface Comment extends Entity {
  created_at: string
  user_id: number
  track_id: number
  timestamp: number
  body: string
  uri: string
  user: Pick<
    User,
    | 'id'
    | 'kind'
    | 'permalink'
    | 'username'
    | 'last_modified'
    | 'uri'
    | 'permalink_url'
    | 'avatar_url'
    | 'followers_count'
    | 'followings_count'
    | 'public_favorites_count'
    | 'reposts_count'
  >
}

export interface Playlist extends Entity {
  artwork_url: string
  created_at: string
  description: null
  downloadable: boolean
  duration: number
  ean: null
  embeddable_by: string
  genre: string
  label: null
  label_id: null
  label_name: null
  last_modified: string
  license: string
  likes_count: number
  permalink: string
  permalink_url: string
  playlist_type: string
  purchase_title: null
  purchase_url: null
  release: null
  release_day: null
  release_month: null
  release_year: null
  sharing: string
  streamable: boolean
  tag_list: string
  tags: string
  title: string
  track_count: number
  tracks: Track[]
  tracks_uri: string
  type: string
  uri: string
  user: Pick<User, 'permalink_url' | 'permalink' | 'username' | 'uri' | 'last_modified' | 'id' | 'kind' | 'avatar_url'>
  user_id: number
}

export interface WebProfile extends Entity {
  created_at: string
  service: string
  title: string
  url: string
  username: string
}

export interface PaginatedResponse<T> {
  collection: T[]
  next_href: string
}

export type PaginatedRequestParameters = Partial<{ id: number | string; limit: number; linkedPartitioning: boolean }>

const API_URL = 'https://api.soundcloud.com'

const str = (obj: Record<string, any>): Record<string, string> => {
  Object.entries(obj).forEach(([k, v]) => (obj[k] = `${v}`))

  return obj
}

const fetchApi = async (
  endpoint: string,
  path: string,
  username: string | number,
  id: string | number,
  opts: PaginatedRequestParameters
) => {
  const params = new URLSearchParams(str({ limit: 50, linkedPartitioning: false, ...opts }))

  const reqUrl = `${API_URL}/${endpoint}/${opts.id || username}/${path}?client_id=${id}&${params.toString()}`

  const res = await fetch(reqUrl)

  const json = await res.json()

  return json
}

export class SoundCloudUser {
  id: string
  secret: string
  username?: number | string
  constructor({ id, secret, user }: SoundCloudInit) {
    this.id = id
    this.secret = secret
    this.username = user
  }
  private async fetch(
    path: string,
    opts: Partial<{
      user: number | string
      limit: number
      linkedPartitioning: boolean
    }>
  ) {
    return await fetchApi('users', path, this.username, this.id, opts)
  }
  /**
   * Returns a user.
   * @param user username or user ID
   */
  async user(user?: number | string): Promise<User> {
    return await this.fetch('', { user })
  }
  async tracks(opts: PaginatedRequestParameters): Promise<PaginatedResponse<Track>> {
    return await this.fetch('tracks', opts)
  }
  /**
   * Returns a list of users who follow that user.
   * @param params request parameters
   */
  async followers(opts: PaginatedRequestParameters): Promise<PaginatedResponse<User>> {
    return await this.fetch('followers', opts)
  }
  /**
   * Returns list of users that user follows.
   * @param params request parameters
   */
  async followings(opts: PaginatedRequestParameters): Promise<PaginatedResponse<User>> {
    return await this.fetch('followings', opts)
  }
  /**
   * Returns a list of user's comments.
   * @param params request parameters
   */
  async comments(opts: PaginatedRequestParameters): Promise<Comment[]> {
    return await this.fetch('followers', opts)
  }
  /**
   * Returns a list of user's playlists.
   * @param params request parameters
   */
  async playlists(opts: PaginatedRequestParameters): Promise<PaginatedResponse<Playlist>> {
    return await this.fetch('playlists', opts)
  }
  /**
   * Returns list of user's links added to their profile (website, facebook, instagram).
   * @param params request parameters
   */
  async webProfiles(opts: PaginatedRequestParameters): Promise<PaginatedResponse<WebProfile>> {
    return await this.fetch('web-profiles', opts)
  }
  /**
   * Returns a list of user's liked tracks.
   * @param params request parameters
   */
  async likedTracks(opts: PaginatedRequestParameters): Promise<PaginatedResponse<Track>> {
    return await this.fetch('likes/tracks', opts)
  }
}

export class SoundCloudTrack {
  id: string
  trackId?: string | number
  constructor({ id, trackId }: SoundCloudInit & { trackId?: number | string }) {
    this.id = id
    this.trackId = trackId
  }
  async track(id: number | string) {
    const res = await fetch(`${API_URL}/tracks/${id || this.trackId}?client_id=${this.id}`)

    const json = await res.json()

    return json
  }
  async streams(id: number | string) {
    const res = await fetch(`${API_URL}/tracks/${id || this.trackId}/streams?client_id=${this.id}`)

    const json = await res.json()

    return json
  }
  async comments(opts: PaginatedRequestParameters) {
    return await fetchApi('tracks', 'comments', opts.id || this.trackId, this.id, opts)
  }
  async favoriters(opts: PaginatedRequestParameters) {
    return await fetchApi('tracks', 'favoriters', opts.id || this.trackId, this.id, opts)
  }
  async related(opts: PaginatedRequestParameters) {
    return await fetchApi('tracks', 'related', opts.id || this.trackId, this.id, opts)
  }
}

/**
 * API client class with methods wrapping the SoundCloud API.
 *
 * @example
 * ```ts
  import { SoundCloudUser } from 'soundsphere'

  const { user } = new SoundCloudUser({
    id: 'CLIENT_ID',
    secret: 'CLIENT_SECRET'
  })
  const { id } = await user.user('uvulauvula')

  const json = (await user.tracks({ user: id }))[1]

  console.log(json)
 * ```
 */
export class SoundCloud {
  id: string
  secret: string
  username?: number | string
  user?: SoundCloudUser
  track?: SoundCloudTrack
  constructor({ id, secret, user }: SoundCloudInit) {
    this.id = id
    this.secret = secret
    this.username = user
    this.user = new SoundCloudUser({ id, secret, user })
    this.track = new SoundCloudTrack({ id })
  }
}
