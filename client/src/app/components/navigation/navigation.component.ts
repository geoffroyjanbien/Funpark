import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  currentDate = new Date();
  @Input() pageTitle: string = '';
  @Input() currentLang: string = 'en';
  @Output() linkClicked = new EventEmitter<void>();
  @Output() menuToggled = new EventEmitter<void>();
  @Output() languageChanged = new EventEmitter<string>();

  onLinkClick(): void {
    this.linkClicked.emit();
  }
  
  toggleMenu(): void {
    this.menuToggled.emit();
  }
  
  switchLanguage(lang: string): void {
    this.languageChanged.emit(lang);
  }
}