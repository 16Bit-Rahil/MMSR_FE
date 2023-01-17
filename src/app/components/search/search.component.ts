import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {NbSearchService} from "@nebular/theme";
import {BehaviorSubject, Subject, take} from "rxjs";
import {SearchService} from "./search.service";
import {Song} from "../../model/song";
import {APIModel} from "../../model/ApiModel";



@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {

  songs:Subject<Song[]> = new Subject<Song[]>();

  searchSub = new BehaviorSubject('')
  imgSrc = new BehaviorSubject("");

  constructor(private search: NbSearchService,
              public searchService: SearchService) {
    this.search.onSearchSubmit().pipe(take(1)).subscribe(s => {
      this.searchSub.next(s.term);
      let song:Song = this.searchService.findSongByName(s.term);
      console.log('search started...')
      console.log('found song: ',song);
      console.log(song.id);
      let similarSongs = this.searchService.findSimilarSongs(song.id);
    })


  }

  ngOnInit(): void {
  }

  getCover(artist: string,album:string){
   return this.searchService.getAlbumCover(artist,album).pipe(take(1))
  }


}
