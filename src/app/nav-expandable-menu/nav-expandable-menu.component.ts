import { Component, ContentChildren, Input, QueryList } from '@angular/core';
import { RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-expandable-menu',
  templateUrl: './nav-expandable-menu.component.html',
  styleUrls: ['./nav-expandable-menu.component.scss']
})
export class NavExpandableMenuComponent {
  @ContentChildren(RouterLinkActive,  {descendants: true})
  navListItems: QueryList<RouterLinkActive> | null = null;

  @Input() expandable = true;
}
