if (typeof fetch === 'undefined') {
  // @ts-ignore
  globalThis.fetch = require('node-fetch')
}

/* Interfaces */

export interface SoundCloudInit {
  id: string
  secret: string
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

export interface Tracks {
  kind: string
  id: number
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

export interface PaginatedResponse<T> {
  collection: T[]
  next_href: string
}

export type PaginatedRequestParameters = Partial<{ user: number | string; limit: number; linkedPartitioning: boolean }>

const API_URL = 'https://api.soundcloud.com'
/**
 * API client class with methods wrapping the SoundCloud API.
 *
 * @example
 * ```ts
  import { SoundCloud } from 'soundsphere'

  const sc = new SoundCloud({
    id: 'CLIENT_ID',
    secret: 'CLIENT_SECRET'
  })
  const { id } = await sc.user('uvulauvula')

  const json = (await sc.tracks({ user: id }))[1]

  console.log(json)
 * ```
 */
export class SoundCloud {
  id: string
  secret: string
  username?: number | string
  constructor({ id, secret, user }: SoundCloudInit) {
    this.id = id
    this.secret = secret
    this.username = user
  }
  /**
   * Returns a user.
   * @param user username or user ID
   */
  async user(user: number | string): Promise<User> {
    const res = await fetch(`${API_URL}/users/${user || this.username}?client_id=${this.id}`)

    const json = await res.json()

    return json
  }
  async tracks({
    user,
    limit = 50,
    linkedPartitioning = false
  }: Partial<{
    user: number | string
    limit: number
    linkedPartitioning: boolean
  }> = {}): Promise<Tracks> {
    const res = await fetch(
      `${API_URL}/users/${user || this.username}/tracks?client_id=${
        this.id
      }&limit=${limit}&linkedPartitioning=${linkedPartitioning}`
    )

    const json = await res.json()

    return json
  }
  /**
   * Returns a list of users who follow that user.
   * @param params request parameters
   */
  async followers({
    limit = 50,
    user,
    linkedPartitioning = false
  }: PaginatedRequestParameters): Promise<PaginatedResponse<User>> {
    const res = await fetch(
      `${API_URL}/users/${user || this.username}/followers?client_id=${
        this.id
      }&limit=${limit}&linkedPartitioning=${linkedPartitioning}`
    )

    const json = await res.json()

    return json
  }
  /**
   * Returns list of users that user follows.
   * @param params request parameters
   */
  async followings({
    limit = 50,
    user,
    linkedPartitioning = false
  }: PaginatedRequestParameters): Promise<PaginatedResponse<User>> {
    const res = await fetch(
      `${API_URL}/users/${user || this.username}/followings?client_id=${
        this.id
      }&limit=${limit}&linkedPartitioning=${linkedPartitioning}`
    )

    const json = await res.json()

    return json
  }

  async comments({ limit = 50, user, linkedPartitioning = false }: PaginatedRequestParameters): Promise<Comment[]> {
    const res = await fetch(
      `${API_URL}/users/${user || this.username}/comments?client_id=${
        this.id
      }&limit=${limit}&linkedPartitioning=${linkedPartitioning}`
    )

    const json = await res.json()

    return json
  }
}
