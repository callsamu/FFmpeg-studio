import { AfterContentInit, Directive, Input, QueryList } from "@angular/core";
import { MatExpansionPanel } from "@angular/material/expansion";
import { RouterLinkActive } from "@angular/router";
import { filter, from, of, mergeMap, tap, map, merge, reduce, scan } from "rxjs";

@Directive({
  selector: '[expandOnActiveLink]',
  exportAs: 'expandOnActiveLink',
  standalone: true,
})
export class ExpandOnActiveLinkDirective {
  @Input()
  links: QueryList<RouterLinkActive> | null = null;

  constructor(private panel: MatExpansionPanel) {}

  ngAfterViewInit(): void {
    if (!this.links) return;

    const events = this.links.map(link => link.isActiveChange);

    merge(...events).pipe(
      scan((active, acc) => active || acc, false),
    ).subscribe(active => {
      if (active) this.panel.open();
    })
  }
}
