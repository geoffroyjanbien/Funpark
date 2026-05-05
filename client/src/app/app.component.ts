import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Funpark Management';
  currentLang = 'en';
  mobileMenuOpen = false;
  pageTitle = '';
  isLoginPage = false;

  constructor(
    private translate: TranslateService,
    private router: Router
  ) {
    // Set default language
    this.translate.setDefaultLang('en');
    
    // Get saved language from localStorage or use default
    const savedLang = localStorage.getItem('language') || 'en';
    this.currentLang = savedLang;
    this.translate.use(savedLang);
    
    // Set document direction based on language
    this.setDirection(savedLang);
  }

  ngOnInit(): void {
    // Set initial login page state
    this.isLoginPage = this.router.url === '/login';
    
    // Subscribe to language changes
    this.translate.onLangChange.subscribe((event) => {
      this.setDirection(event.lang);
      this.updatePageTitle();
    });
    
    // Subscribe to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isLoginPage = this.router.url === '/login';
      this.updatePageTitle();
    });
    
    // Set initial page title
    this.updatePageTitle();
  }

  switchLanguage(lang: string): void {
    this.currentLang = lang;
    this.translate.use(lang);
    localStorage.setItem('language', lang);
    this.setDirection(lang);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  private setDirection(lang: string): void {
    const htmlTag = document.getElementsByTagName('html')[0];
    if (lang === 'ar') {
      htmlTag.setAttribute('dir', 'rtl');
      htmlTag.setAttribute('lang', 'ar');
    } else {
      htmlTag.setAttribute('dir', 'ltr');
      htmlTag.setAttribute('lang', 'en');
    }
  }
  
  private updatePageTitle(): void {
    const url = this.router.url;
    let titleKey = 'NAV.DASHBOARD';
    
    if (url.includes('/revenue')) {
      titleKey = 'NAV.REVENUE';
    } else if (url.includes('/expenses')) {
      titleKey = 'NAV.EXPENSES';
    } else if (url.includes('/investments')) {
      titleKey = 'NAV.INVESTMENTS';
    } else if (url.includes('/salaries')) {
      titleKey = 'NAV.SALARIES';
    } else if (url.includes('/reports')) {
      titleKey = 'NAV.REPORTS';
    } else if (url.includes('/settings')) {
      titleKey = 'NAV.SETTINGS';
    }
    
    this.translate.get(titleKey).subscribe((text: string) => {
      this.pageTitle = text;
    });
  }
}