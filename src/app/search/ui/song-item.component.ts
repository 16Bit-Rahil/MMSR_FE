import { Component, Input, OnInit } from '@angular/core';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';
import { Song } from 'src/app/model/song';

@Component({
    selector: 'song-item',
    template: ` 
    <nb-card-header class="header">
          <img [src]="song.imgLink">
    </nb-card-header>
    <nb-card-body>
      <div class="song-content">
        <div class="song-title">{{song.songName}}</div>
        <div class="song-artist">{{song.artist}}</div>
        <div class="song-release">{{song.albumName}}</div>
      </div>
    </nb-card-body>
    <nb-card-footer><button (click)="goToLink(song.youtubeLink)" nbButton>YouTube</button></nb-card-footer>
    `,
    styleUrls: ['./song-item.component.css'],
})

export class SongItemComponent implements OnInit {
    @Input() song!: Song;
    
    constructor() { }

    ngOnInit() { }
    
    goToLink(youtubeLink: string) {
        window.open(youtubeLink,"_blank")
      }
}