import { BaseApiService } from "./apiClient";

export interface ArtistSummary {
  id: string;
  name: string;
  profile_picture?: string;
  followersCount?: number;
}

export interface ArtistProfile {
  id: string;
  bannerUrl?: string;
  name?: string;
  artisticName?: string;
  bio?: string;
  followers_count?: number;
  // ... other fields returned by the artists service
}

export class ArtistsService extends BaseApiService {
  private readonly BASE_PATH = "/artists";

  async getPlatformArtists(): Promise<ArtistSummary[]> {
    const response = await this.get<{ artists: any[] }>(`${this.BASE_PATH}/`);
    const raw = response.artists || [];
    const parsed: ArtistSummary[] = raw.map((item: any) => ({
      id: String(item.id ?? item.userId ?? item.artistId ?? ""),
      name: item.name ?? item.artisticName ?? item.artistName ?? "",
      profile_picture: item.profile_picture ?? item.backgroundUrl ?? undefined,
      followersCount: item.followersCount ?? item.followers ?? undefined,
    }));
    return parsed;
  }

  async getArtistProfile(artistId: string): Promise<ArtistProfile> {
    const response = await this.get<any>(`${this.BASE_PATH}/profiles/${artistId}`);
    const mapped: ArtistProfile = {
      id: String(response.userId ?? response.id ?? artistId),
      bannerUrl: response.backgroundUrl ?? response.bannerUrl,
      name: response.name ?? response.artisticName,
      artisticName: response.artisticName ?? response.name,
      bio: response.bio ?? response.description,
      followers_count: response.followersCount ?? response.followers,
      ...response,
    };
    return mapped;
  }
}

export const artistsService = new ArtistsService();
