import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../service/search.service';

@Component({
  selector: 'app-song-detail-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './song-detail-page.component.html',
  styleUrls: ['./song-detail-page.component.css']
})
export class SongDetailPageComponent implements OnInit {


  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
  }

}
