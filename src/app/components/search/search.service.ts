import {Injectable} from '@angular/core';
import {Song} from "../../model/song";
import {HttpClient} from "@angular/common/http";
import {SearchedSong} from "../../model/searched-song";
import {APIModel} from "../../model/ApiModel";
import {BehaviorSubject, map, mergeMap, Observable, Subject, switchMap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  songs: Song[] = [];
  similarSong: SearchedSong | undefined;
  topTenSimilarSongs$ = new Subject<Song[]>();
  topTenSimilarSongs:Song[] = [];
  private similarSongsList: string[] = [];
  constructor(private http: HttpClient) {


    this.http.get('assets/data/id_information_mmsr.tsv', {responseType: "text"}).subscribe(data => {
      let csvToRowArray = data.split('\n');
      for (let idx = 1; idx < csvToRowArray.length; idx++) {
        let row = csvToRowArray[idx].split('\t');
        this.songs.push(new Song(row[0], row[1], row[2], row[3]))
      }
      console.log(this.songs);
    })



  }
  findSongByName(name:string):Song {
    let song = this.songs.find(x => x.song == name);
    console.log('findSongByName: ',song)
    if(song == undefined) {
      song = new Song('','','','');
    }
    return song;
  }

  findSongById(id:string) {
    return this.songs.find(x => x.id == id);
  }

  findSimilarSongs(id:string) {

     this.http.get('assets/data/simple_borda.csv', {responseType: "text"}).subscribe(data => {
      //                 ,1,2,...
      //0009fFIM1eYThaPg,FYN6Nw0CQ7WR59AP,Uly30J1KEdC9awfI,
      let csvToRowArray = data.split('\n');
      for (let idx = 1; idx < csvToRowArray.length; idx++) {
        let row = csvToRowArray[idx].split(',');

        if(row[0] === id) {

          for (let i = 1; i < row.length; i++) {
            this.similarSongsList.push(row[i]);
            console.log(row[i])
          }

          this.similarSong = new SearchedSong(row[0],this.similarSongsList)
        }

      }
      console.log(this.similarSong);


      for (let i = 0; i < 10; i++) {
        let s:Song = this.findSongById(this.similarSongsList[i])!;
        this.topTenSimilarSongs.push(s);
      }


      console.log(this.topTenSimilarSongs);
      this.topTenSimilarSongs$.next(this.topTenSimilarSongs);
    })


  }

  getSimilarSongs(): Observable<Song[]>{
    return this.topTenSimilarSongs$;
  }

  getAlbumCover(artist:string, album_name:string) {
    console.log(encodeURI('https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=76e37b8f0ca99ecb3d3a6ac4132dc0ef&artist='+artist.trim()+'&album='+ album_name.trim() +'&format=json'))
    return this.http.get<APIModel>(encodeURI('https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=76e37b8f0ca99ecb3d3a6ac4132dc0ef&artist='+artist.trim()+'&album='+ album_name.trim() +'&format=json'))
  }
}
