import {ContentChild, Injectable} from '@angular/core';
import {Song} from "../../model/song";
import {HttpClient, HttpParams} from "@angular/common/http";
import {APIModel} from "../../model/ApiModel";
import {BehaviorSubject, forkJoin, from, lastValueFrom, map, mergeMap, Observable, of, ReplaySubject, Subject, switchMap, take, tap} from "rxjs";
import { PageResponse } from 'src/app/model/page-response';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  readonly baseUrl = '/api/songs'

  private searchResult$ = new BehaviorSubject<PageResponse<Song>>({} as PageResponse<Song>);

  constructor(private http: HttpClient,
    private router:Router) {}

  private search$(term:string,page?:number){
    return this.http.get<PageResponse<Song>>(`${this.baseUrl}?search=${encodeURIComponent(term)}&page=${page ?? 0}&pageSize=10`).pipe(
      switchMap(page => {
        if(page.totalElements === 0) {
          return of(page)
        }
        return this.getSongsWithAlbumCover(page.content).pipe(
          map(songs => ({...page,content: songs} as PageResponse<Song>)))
      })
    )
  }

  search(term: string){
    this.searchResult$.next({} as PageResponse<Song>);
    this.search$(term).subscribe((page) => {
      this.searchResult$.next(page)
      this.router.navigate(['search-result',term])
    });

  }

  loadMore(term: string,page:number){
    this.search$(term,page).subscribe({
      next:(resp) => {
          this.searchResult$.next({
            ...resp,
            content: [...this.searchResult$.value?.content,...resp.content]
          });
      },
    })
  }
  getSearchResult(): Observable<PageResponse<Song>>{
    return this.searchResult$
  }
  
  getSimilarSongs(id: string,page: number){
    return this.http.get<PageResponse<Song>>(`${this.baseUrl}/song/${encodeURIComponent(id)}&page=${page}&pageSize=10`) 
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
