import {ContentChild, Injectable} from '@angular/core';
import {Song} from "../../model/song";
import {HttpClient, HttpParams} from "@angular/common/http";
import {APIModel} from "../../model/ApiModel";
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  forkJoin,
  from,
  lastValueFrom,
  map,
  mergeMap,
  Observable,
  of,
  ReplaySubject,
  Subject,
  switchMap,
  take,
  tap
} from "rxjs";
import { PageResponse } from 'src/app/model/page-response';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SimilarSongService {

  readonly baseUrlSimilarSong = '/api/similar-song'

  private similarSongs$ = new BehaviorSubject<PageResponse<Song>>({} as PageResponse<Song>);

  constructor(private http: HttpClient) {}

  private getSimilarSongs$(id:string,page?:number){
    return this.http.get<PageResponse<Song>>(`${this.baseUrlSimilarSong}/${encodeURIComponent(id)}?page=${page ?? 0}&pageSize=10`).pipe(
      switchMap(page => {
        if(page.totalElements === 0) {
          return of(page)
        }
        return this.getSongsWithAlbumCover(page.content).pipe(
          map(songs => ({...page,content: songs} as PageResponse<Song>)))
      })
    )
  }

  getSimilarSongs(id: string){
    this.similarSongs$.next({} as PageResponse<Song>);
    this.getSimilarSongs$(id).subscribe((page) => {
      this.similarSongs$.next(page)
    });

  }

  loadMore(id: string,page:number){
    this.getSimilarSongs$(id,page).subscribe({
      next:(resp) => {
          this.similarSongs$.next({
            ...resp,
            content: [...this.similarSongs$.value.content,...resp.content]
          });
      },
    })
  }

  // die hier subscriben im Details - Page
  getSimilarSongsPage(): Observable<PageResponse<Song>>{
    return this.similarSongs$
  }

  private getSongsWithAlbumCover(songs: Song[]): Observable<Song[]>{
    return forkJoin<Song[]>(songs.map( song =>
      this.getAlbumCover(song.artist,song.albumName).pipe(
        map(val => ({...song,imgLink:val.album.image[3]['#text']}))
      )
    ))
  }

  private getAlbumCover(artist:string, album_name:string) {
    return this.http.get<APIModel>(encodeURI('https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=76e37b8f0ca99ecb3d3a6ac4132dc0ef&artist='+artist.trim()+'&album='+ album_name.trim() +'&format=json'))
  }
  // https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=76e37b8f0ca99ecb3d3a6ac4132dc0ef&artist=cher&track=believe&format=json
  private getTrackInfo(track:string, artist:string): Observable<Track> {
    return this.http.get<{track:Track}>(encodeURI('https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=76e37b8f0ca99ecb3d3a6ac4132dc0ef&artist='+artist.trim()+'&track='+ track.trim() +'&format=json')).pipe(
      map((resp:{track:Track}) => resp.track)
    );
  }
}
