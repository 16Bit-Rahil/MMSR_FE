import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {NbSearchService} from "@nebular/theme";
import {BehaviorSubject, Observable, Subject, forkJoin, map, switchMap, take} from "rxjs";
import {SearchService} from "../service/search.service";
import {Song} from "../../model/song";
import { Validators } from '@angular/forms';
import { PageResponse } from 'src/app/model/page-response';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent{

  searchResult$ = new BehaviorSubject<PageResponse<Song> | null>(null);
  searchTerm = '';
  page = 0;
  notFound$ = new BehaviorSubject<boolean>(false);

  constructor(private search: NbSearchService,
              public searchService: SearchService) {

    this.search.onSearchSubmit().subscribe(s => {
      this.page = 0;
      this.searchTerm = s.term;
      this.searchResult$.next(null);
      this.notFound$.next(false);

      this.searchService.search(s.term,this.page).subscribe({
        next:(resp) => {
          console.log(resp);
          
          if(resp.totalElements === 0) {
              this.notFound$.next(true);
              return
            }
            this.searchResult$.next(resp);
            this.notFound$.next(false);
        },
      })
    })
  }

  loadMore(){
    this.page++;
    this.searchService.search(this.searchTerm,this.page).subscribe({
      next:(resp) => {
          this.searchResult$.next({
            ...resp,
            content: [...this.searchResult$.value!.content,...resp.content]
          });
      },
    })
  }

}
