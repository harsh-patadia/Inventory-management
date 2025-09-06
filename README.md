# Stock Management Admin Panel

A modern, responsive admin panel for stock management built with React, TypeScript, Material-UI, and Tailwind CSS.

## Features

- **Authentication**: Login and registration pages with beautiful UI
- **Dashboard**: Overview with statistics, charts, and recent activity
- **Product Management**: Add, edit, delete, and manage stock quantities
- **Category Management**: Organize products with categories and subcategories
- **User Management**: Manage users and roles
- **Settings**: User preferences and account settings
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **State Management**: Redux Toolkit for global state management
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Material-UI** - Component library
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Vite** - Build tool

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Demo Credentials

- **Username**: admin
- **Password**: admin123

## Project Structure

```
src/
├── admin/                 # Admin panel components
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   └── router/           # Routing configuration
├── store/                # Redux store
│   ├── slices/           # Redux slices
│   └── staticData.ts     # Sample data
├── utils/                # Utility functions
│   └── theme.ts          # Theme configuration
└── components/           # Shared components
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Overview

### Dashboard
- Product statistics
- Low stock alerts
- Recent activity
- Quick overview cards

### Product Management
- View all products
- Increase/decrease stock quantities
- Toggle active/inactive status
- Product details and editing

### Category Management
- Organize products by categories
- Create and manage subcategories
- Category status management

### User Management
- User list with roles
- Role assignment
- User status management

### Settings
- Profile information
- Notification preferences
- Account settings

## Theme

The application uses a custom theme with a beautiful color palette:
- Primary: Blue gradient (#667eea to #764ba2)
- Secondary: Gray scale
- Accent: Purple
- Success: Green
- Warning: Orange
- Error: Red

## State Management

The application uses Redux Toolkit for state management with the following slices:
- **userSlice**: User authentication and management
- **productSlice**: Product data and stock management
- **categorySlice**: Category management
- **subCategorySlice**: Subcategory management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.