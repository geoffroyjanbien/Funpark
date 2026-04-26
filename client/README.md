# Funpark Management System - Frontend

A modern, responsive web application for managing Funpark financial operations with a beautiful dark theme interface.

## 🎨 Features

- **Dark Theme UI**: Professional dark-themed interface optimized for business use
- **Responsive Design**: Mobile-first design that works on all devices
- **Revenue Management**: Complete CRUD operations for tracking all revenue sources
- **Expense Tracking**: Monitor and categorize operational expenses
- **Investment Monitoring**: Track capital projects and long-term investments
- **Financial Dashboard**: Real-time overview of key financial metrics
- **Reports & Analytics**: Comprehensive financial reporting and profit distribution
- **Real-time Updates**: Live data synchronization with backend API
- **Search & Filtering**: Advanced search and filtering capabilities
- **Data Validation**: Client-side and server-side validation
- **Excel Integration**: Import/export functionality for bulk operations

## 🛠️ Tech Stack

- **Framework**: Angular 16+
- **Language**: TypeScript
- **Styling**: CSS with CSS Variables (Dark Theme)
- **HTTP Client**: Angular HttpClient
- **Forms**: Reactive Forms with validation
- **Routing**: Angular Router with lazy loading
- **Build Tool**: Angular CLI
- **State Management**: Component-based state
- **UI Components**: Custom components with consistent theming

## 📁 Project Structure

```
client/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── navigation/          # Main navigation sidebar
│   │   ├── features/                # Feature modules
│   │   │   ├── dashboard/          # Main dashboard
│   │   │   ├── revenue/            # Revenue management
│   │   │   ├── expenses/           # Expense tracking
│   │   │   ├── investments/        # Investment monitoring
│   │   │   └── reports/            # Financial reports
│   │   ├── services/               # API services
│   │   │   └── revenue.service.ts  # Revenue API service
│   │   ├── app-routing.module.ts   # Main routing
│   │   ├── app.module.ts          # Main application module
│   │   └── app.component.*        # Root component
│   ├── assets/                    # Static assets
│   ├── environments/              # Environment configurations
│   ├── styles.css                 # Global styles & theme variables
│   ├── index.html                 # Main HTML file
│   ├── main.ts                    # Application bootstrap
│   └── polyfills.ts               # Browser polyfills
├── angular.json                   # Angular CLI configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies and scripts
```

## 🚀 Installation

1. **Prerequisites**
   - Node.js (v16 or higher)
   - npm or yarn
   - Angular CLI (`npm install -g @angular/cli`)

2. **Clone and Install**
   ```bash
   cd client
   npm install
   ```

3. **Backend Setup**
   Ensure the backend server is running on `http://localhost:3000`

## 🏃‍♂️ Running the Application

### Development Server
```bash
npm start
# or
ng serve --port 4200
```
Navigate to `http://localhost:4200`

### Production Build
```bash
npm run build
```

### Build for Production
```bash
ng build --configuration production
```
Build artifacts will be stored in the `dist/` directory.

## 🎯 Key Features

### Dashboard
- **Financial Overview**: Total revenue, expenses, investments, and net profit
- **Quick Stats**: Key metrics at a glance
- **Recent Activity**: Latest revenue and expense entries
- **Navigation**: Easy access to all features

### Revenue Management
- **Add Revenue**: Create new revenue entries with validation
- **Edit/Delete**: Modify or remove existing entries
- **Search & Filter**: Find specific revenue entries
- **Categories**: Tickets, Food & Beverage, Merchandise, Games, Parking
- **Real-time Totals**: Automatic calculation of total revenue

### Navigation
- **Fixed Sidebar**: Always accessible navigation menu
- **Active States**: Visual indication of current page
- **Responsive**: Collapsible on mobile devices
- **Dark Theme**: Consistent with overall design

### Dark Theme System
- **CSS Variables**: Centralized color and spacing system
- **Consistent Styling**: Uniform appearance across all components
- **Accessibility**: High contrast ratios for readability
- **Custom Scrollbars**: Themed scrollbar styling

## 🔧 Configuration

### API Configuration
The frontend connects to the backend API at `http://localhost:3000`. Update service files if needed:

```typescript
// In services/*.service.ts
private apiUrl = 'http://localhost:3000/api/revenue';
```

### Theme Customization
Modify theme variables in `src/styles.css`:

```css
:root {
  --primary-bg: #1a1a1a;
  --primary-accent: #4a9eff;
  /* ... other variables */
}
```

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- **Desktop**: Full sidebar navigation and multi-column layouts
- **Tablet**: Adapted navigation and grid layouts
- **Mobile**: Collapsed navigation and single-column layouts

## 🧪 Development

### Code Style
- **TypeScript**: Strict mode enabled
- **Angular**: Follows Angular style guide
- **SCSS**: CSS with variables for theming

### Adding New Features
1. Create feature module in `src/app/features/`
2. Add routing in `app-routing.module.ts`
3. Update navigation component
4. Create service for API communication

### Component Structure
Each feature follows this structure:
```
feature-name/
├── feature-name.component.ts
├── feature-name.component.html
├── feature-name.component.css
├── feature-name-routing.module.ts
└── feature-name.module.ts
```

## 🚀 Deployment

### Build for Production
```bash
ng build --configuration production --output-path docs
```

### Serve Static Files
The built files can be served by any static file server:
- Nginx
- Apache
- Firebase Hosting
- Netlify
- GitHub Pages

### Environment Configuration
Create environment files for different deployments:
- `src/environments/environment.ts` (development)
- `src/environments/environment.prod.ts` (production)

## 🔍 Testing

### Unit Tests
```bash
ng test
```

### End-to-End Tests
```bash
ng e2e
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow Angular best practices
- Use reactive forms for data entry
- Implement proper error handling
- Add loading states for better UX
- Ensure responsive design
- Test on multiple browsers

## 📊 Performance

- **Lazy Loading**: Feature modules loaded on demand
- **Tree Shaking**: Unused code removed in production builds
- **Bundle Optimization**: Angular CLI optimizations enabled
- **Caching**: Service worker for offline capability (future)

## 🐛 Troubleshooting

### Common Issues

1. **Backend Connection Failed**
   - Ensure backend server is running on port 3000
   - Check CORS configuration
   - Verify API endpoints

2. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check TypeScript errors
   - Verify Angular CLI version

3. **Styling Issues**
   - Check CSS variables in :root
   - Verify component CSS specificity
   - Test responsive breakpoints

## 📝 Scripts

```json
{
  "start": "ng serve --port 4200",
  "build": "ng build",
  "test": "ng test",
  "lint": "ng lint",
  "e2e": "ng e2e"
}
```

## 🔄 API Integration

The frontend communicates with the backend through RESTful APIs:

- **Revenue Service**: `RevenueService` for revenue operations
- **HTTP Interceptors**: Future implementation for authentication
- **Error Handling**: Global error handling for API failures
- **Loading States**: UI feedback during API calls

## 🎨 Design System

### Colors
- **Primary Background**: Dark gray (#1a1a1a)
- **Secondary Background**: Medium gray (#2d2d2d)
- **Accent**: Blue (#4a9eff)
- **Success**: Green (#4ade80)
- **Error**: Red (#ef4444)

### Typography
- **Font Family**: System fonts (Roboto, Helvetica)
- **Text Colors**: White primary, gray variants
- **Headings**: Bold, hierarchical sizing

### Components
- **Buttons**: Primary, secondary, success, danger variants
- **Forms**: Consistent input styling with validation
- **Cards**: Container components with shadows
- **Tables**: Responsive data tables with hover states

## 📞 Support

For support and questions:
1. Check this README for common solutions
2. Review browser console for errors
3. Ensure backend API is accessible
4. Check network tab for failed requests

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Angular team for the excellent framework
- Express.js for the robust backend
- Open source community for inspiration

---

**Built with ❤️ for Funpark Management - Making financial management fun again!** 🎢💰</content>
<parameter name="filePath">c:\Users\geoff\Desktop\dev\Funpark\client\README.md