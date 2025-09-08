# Melodia Backoffice

A modern backoffice application built with Vite, React, TypeScript, and Material UI, featuring a comprehensive admin dashboard with mock data.

## 🚀 Technologies

- **Vite** - Next generation frontend tooling
- **React 19** - UI library with modern features
- **TypeScript** - Type safety for JavaScript
- **Material UI v7** - React component library with Material Design
- **Emotion** - CSS-in-JS library for styling
- **Axios** - HTTP client for API requests
- **TanStack React Query** - Data fetching, caching, and synchronization
- **React Query DevTools** - Development tools for debugging queries

## 📦 Features

- ⚡ Fast development with Vite HMR
- 🎨 Material Design components and theming
- 📱 Responsive admin dashboard
- 🎯 TypeScript for type safety
- 🏗️ Modular component architecture
- 🎨 Custom theme configuration
- 🔄 Advanced data fetching with React Query
- 📡 Axios-based API client with interceptors
- 🛠️ Service layer architecture with mock data
- 🎣 Custom hooks for data management
- 🔍 React Query DevTools integration
- 📊 Admin dashboard with real-time mock data
- 📋 Data tables with pagination, filtering, and search
- 👥 User management interface
- 🎵 Song management interface
- 📈 Statistics and analytics dashboard

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

## 🎯 Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Build

Build for production:
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── admin/          # Admin dashboard components
│   │   ├── Dashboard.tsx    # Main dashboard with stats
│   │   ├── UsersList.tsx    # User management table
│   │   ├── SongsList.tsx    # Song management table
│   │   └── index.ts         # Admin exports
│   ├── Header.tsx      # Top navigation bar
│   ├── Sidebar.tsx     # Side navigation menu
│   ├── DataDemo.tsx    # React Query demo component
│   └── index.ts        # Component exports
├── services/           # API services layer (with mock data)
│   ├── apiClient.ts    # Base Axios client with interceptors
│   ├── userService.ts  # User management API calls
│   ├── musicService.ts # Music management API calls
│   └── index.ts        # Service exports
├── hooks/              # Custom React Query hooks
│   ├── queryClient.ts  # React Query configuration
│   ├── useUsers.ts     # User data hooks
│   ├── useMusic.ts     # Music data hooks
│   └── index.ts        # Hook exports
├── theme.ts            # Material UI theme configuration
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── ...
```

## 🎨 Mock Data

The application currently uses mock data to demonstrate functionality:

### Users Mock Data
- 5 sample users with different roles (admin, moderator, user)
- User avatars from Pravatar
- Realistic timestamps and status

### Songs Mock Data  
- 5 sample songs with complete metadata
- Cover images from Picsum
- Play counts and genre information
- Release dates and artist information

### Features Demonstrated
- **Dashboard**: Statistics cards, top genres, recent users, recent songs
- **User Management**: Searchable table with filtering, pagination, role management
- **Song Management**: Searchable table with genre filtering, play count display
- **Real-time Updates**: All data updates reflect immediately across components

## 🎨 Customization

### Theme
The Material UI theme can be customized in `src/theme.ts`. It includes:
- Color palette configuration
- Typography settings
- Component style overrides
- Spacing and shape customization

### API Configuration
Configure API settings in `.env`:
```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

### Switching from Mock to Real API
To connect to a real backend API:

1. **Update Service Methods**: Uncomment the real API calls in service files:
   ```typescript
   // In userService.ts or musicService.ts
   // Uncomment lines like:
   // return this.get<UsersResponse>(this.endpoint, { params })
   
   // And comment out or remove the mock implementations
   ```

2. **Configure Environment**: Update your `.env` file with real API endpoint
3. **Handle Authentication**: Implement JWT token management in `apiClient.ts`
4. **Error Handling**: Customize error responses for your API

### Services Architecture
- `BaseApiService` - Base class with common HTTP methods and interceptors
- `UserService` - User management endpoints with mock data
- `MusicService` - Music management endpoints with mock data
- All services extend the base class for consistency

### React Query Hooks
- `useUsers` - Fetch users with pagination and filters
- `useUser` - Fetch single user by ID
- `useCreateUser` - Create new user with optimistic updates
- `useUpdateUser` - Update user data
- `useDeleteUser` - Delete user
- `useSongs` - Fetch songs with filters
- `useMusicStats` - Fetch music statistics
- And many more with caching, background refetching, and error handling

### Components
- `Header` - Responsive app bar with menu toggle and user account
- `Sidebar` - Collapsible navigation drawer with menu items
- `Dashboard` - Statistics overview with charts and recent data
- `UsersList` - Data table with search, filtering, and actions
- `SongsList` - Data table with genre filtering and play counts
- `DataDemo` - Example component showing React Query usage

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🎯 Next Steps

1. Add routing with React Router
2. Implement authentication with JWT tokens
3. Connect to a real backend API
4. Add data tables with sorting and filtering
5. Implement file upload functionality
6. Add form validation with React Hook Form
7. Implement real-time features with WebSockets
8. Add comprehensive error boundaries
9. Set up unit testing with Vitest
10. Add end-to-end testing with Playwright

## 🔧 Development Tips

### React Query DevTools
The React Query DevTools are automatically included in development mode. Look for the tanstack logo in the bottom-left corner of your browser to inspect queries, mutations, and cache.

### API Integration
To connect to a real API:
1. Update `VITE_API_BASE_URL` in `.env`
2. Implement authentication in `apiClient.ts`
3. Add error handling for your specific API responses
4. Customize the service methods to match your API endpoints
