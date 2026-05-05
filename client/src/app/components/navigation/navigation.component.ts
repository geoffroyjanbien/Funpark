import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

interface User {
  id: string;
  username: string;
  full_name: string;
  role: 'admin' | 'readonly';
}

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  currentDate = new Date();
  currentUser: User | null = null;
  @Input() pageTitle: string = '';
  @Input() currentLang: string = 'en';
  @Output() linkClicked = new EventEmitter<void>();
  @Output() menuToggled = new EventEmitter<void>();
  @Output() languageChanged = new EventEmitter<string>();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  signOut(): void {
    this.authService.logout();
  }

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