import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../service/search.service';
import {ActivatedRoute} from "@angular/router";
import {NbLayoutModule} from "@nebular/theme";
import {Song} from "../../../model/song";
import {Track} from "../../../model/TrackInfo";

@Component({
  selector: 'app-song-detail-page',
  standalone: true,
  imports: [CommonModule, NbLayoutModule],
  templateUrl: './song-detail-page.component.html',
  styleUrls: ['./song-detail-page.component.css']
})
export class SongDetailPageComponent implements OnInit {

  songId: any;
  // @ts-ignore
  song: Song;
  // @ts-ignore
  songWithCover: Song;

  // @ts-ignore
  trackInfo: Track;
  constructor(public searchService: SearchService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.songId = this.route.snapshot.params['songId'];
    this.searchService.getSongById(this.songId).subscribe(data => {
      this.song = data;
      console.log(this.song)
      this.searchService.getTrackInfo(this.song.songName, this.song.artist).subscribe(data => {
        this.trackInfo = data;
        console.log(data)
      })
      this.searchService.getSongWithAlbumCover(this.song).subscribe(data => {
        this.songWithCover = data;
      });
    })

  }

  setDefaultCover() {
    this.song.imgLink = 'http://www.scottishculture.org/themes/scottishculture/images/music_placeholder.png';
  }
}
