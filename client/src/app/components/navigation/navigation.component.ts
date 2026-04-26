import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  currentDate = new Date();
  @Output() linkClicked = new EventEmitter<void>();

  onLinkClick(): void {
    this.linkClicked.emit();
  }
}