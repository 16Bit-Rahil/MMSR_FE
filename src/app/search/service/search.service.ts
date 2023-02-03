import {ContentChild, Injectable} from '@angular/core';
import {Song} from "../../model/song";
import {HttpClient, HttpParams} from "@angular/common/http";
import {APIModel} from "../../model/ApiModel";
import {BehaviorSubject, forkJoin, from, lastValueFrom, map, mergeMap, Observable, of, Subject, switchMap, take, tap} from "rxjs";
import { PageResponse } from 'src/app/model/page-response';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  readonly baseUrl = '/api/songs'

  constructor(private http: HttpClient) {}

  search(term: string,page: number): Observable<PageResponse<Song>>{
    return this.http.get<PageResponse<Song>>(`${this.baseUrl}?search=${encodeURIComponent(term)}&page=${page}&pageSize=10`).pipe(
      switchMap(page => {
        if(page.totalElements === 0) {
          return of(page)
        }
        return this.getSongsWithAlbumCover(page.content).pipe(
          map(songs => ({...page,content: songs} as PageResponse<Song>)))
      })
    );
  }
  
  getSimilarSongs(id: string){
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
}
