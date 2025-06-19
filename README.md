# <img src="public/favicono7.png" width="25" alt="Events7 Logo" /> Events7

Hi. Welcome to the Events7 Fullstack Web Developer Expertise Test. This readme is mostly generated, but i have added some caveats that could be important and clarify some things at the end. Building this was quite fun. Hope to hear from you soon so we can talk the project over.

## 🚀 Features

- **Event Management**: Create, view, and manage events with different types (crosspromo, liveops, app, ads)
- **Advanced Filtering**: Filter events by type, priority, and search through titles and descriptions
- **Real-time Search**: Debounced search functionality to prevent API spam
- **Pagination**: Efficient pagination with customizable page sizes
- **Sorting**: Sort events by various fields in ascending or descending order
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-friendly interface
- **Type Safety**: Full TypeScript support for better development experience
- **Testing**: Comprehensive unit and end-to-end testing with Vitest and Playwright

## 🛠️ Tech Stack

- **Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **UI Components**: PrimeVue 4
- **Styling**: Tailwind CSS 4
- **Routing**: Vue Router 4
- **Build Tool**: Vite
- **Testing**:
  - Unit Tests: Vitest + Vue Test Utils
  - E2E Tests: Playwright
- **Linting**: ESLint + Prettier
- **Icons**: PrimeIcons

## 📋 Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

## 🚀 Getting Started

### Installation

1. Clone the repository:

```bash
git clone git@github.com:vilarb/events7-fe.git
cd events7-fe
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

```bash
# Start development server
- `npm run dev`

# Build for production
- `npm run build`

# Preview production build
- `npm run preview`

# Run unit tests
- `npm run test:unit`

# Run end-to-end tests
- `npm run test:e2e`

# Lint and fix code2e`
- `npm run lint`

# Format code with Prettier
- `npm run format`

# Run TypeScript type checking
- `npm run type-check`
```

## 📁 Project Structure

```
src/
├── components/          # Vue components
│   ├── dialogs/        # Dialog components
│   ├── table/          # Table-related components
│   └── ui/             # Reusable UI components
├── composables/        # Vue composables for state management
│   └── api/           # API-related composables
├── router/            # Vue Router configuration
├── types/             # TypeScript type definitions
├── views/             # Page components
└── assets/            # Static assets
```

## 💼 State Management

The application uses Vue 3 Composition API instead of a traditional state management library. The state is therefore managed with custom composables:

- `useEvents()` - Event data and operations
- `useUser()` - User authentication and IP detection
- `useApiFetch()` - Base API functionality

## Testing

All directories include a `__tests__` directory which includes the unit tests for the files in that directory.

### Unit Tests

Run unit tests with:

```bash
npm run test:unit
```

Tests are located in `__tests__` directories alongside their corresponding components.

### End-to-End Tests

Run E2E tests with:

```bash
npm run test:e2e
```

Uses Playwright for browser automation and testing.

## 🎨 Styling

The application uses Tailwind CSS 4 with PrimeVue components for a consistent and modern design. The theme system supports:

- Light and dark mode (system)
- Responsive design
- Custom component styling
- PrimeVue theme integration

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory for environment-specific configuration:

```env
VITE_API_BASE_URL=your_backend_base_url
```

## 💡 Caveats

### Authentication

The app uses the /user/authorization endpoint that is fairly unreliable. This means that while the user can intially be allowed to create events of type ADS, this can change by the time the user actually tries to create an event and vice versa.

This can somewhat effect the user experience, but must be taken into consideration due to the unreliability of the https://europe-west1-o7tools.cloudfunctions.net/fun7-ad-partner-expertise-test api.

### Getting the IP address

As the backend currently lives in a docker container on the same machine without a proxy, a helper is implemented. This means that the ip is acquired by an api call to the free https://api.ipify.org service before each route change (in case it has not yet ben acquired).

✽ Removing this helper call will not effect the working of the aplication, but the user will never get authorization for creating the events of type ads, due to the fact that the API call will never leave the local network.
