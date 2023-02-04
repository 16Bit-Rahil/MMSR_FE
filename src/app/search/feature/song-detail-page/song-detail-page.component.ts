import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../service/search.service';
import {ActivatedRoute} from "@angular/router";
import {NbLayoutModule} from "@nebular/theme";
import {Song} from "../../../model/song";
import {Track} from "../../../model/TrackInfo";
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-song-detail-page',
  standalone: true,
  imports: [CommonModule, NbLayoutModule],
  templateUrl: './song-detail-page.component.html',
  styleUrls: ['./song-detail-page.component.css']
})
export class SongDetailPageComponent implements OnInit {

  songId!: string;
  detailsData = new BehaviorSubject<{song: Song, trackInfo: Track} | null>(null);
  constructor(public searchService: SearchService, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.songId = this.route.snapshot.params['songId'];
    this.searchService.getSongAndTrackDetailById(this.songId).subscribe(resp =>{
      
      console.log(resp.trackInfo);
      this.detailsData.next(resp)
    })
  }

  setDefaultCover(song:Song) {
    song.imgLink = 'http://www.scottishculture.org/themes/scottishculture/images/music_placeholder.png';
  }
}
