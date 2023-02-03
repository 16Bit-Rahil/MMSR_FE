import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../service/search.service';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-song-detail-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './song-detail-page.component.html',
  styleUrls: ['./song-detail-page.component.css']
})
export class SongDetailPageComponent implements OnInit {

  songId: any;
  constructor(private searchService: SearchService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.songId = this.route.snapshot.params['id'];
  }

}
