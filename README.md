# ERP System Demo

## Overview

This is a demo ERP (Enterprise Resource Planning) system built using **React**, **TypeScript**, and **Vite**. The system is designed to streamline project management, financial tracking, supplier management, and user administration.

## Features

- **Dashboard**: Provides an overview of active projects, monthly costs, and quick actions.
- **Project Management**: Create, view, and manage projects with detailed information.
- **Financials**: Track expenses, invoices, and payments with visual charts and data tables.
- **Supplier Management**: Manage supplier details, purchase orders, and onboarding processes.
- **User Management**: Add, edit, and manage user roles and permissions.
- **Settings**: Configure system preferences, default values, and regional settings.

## Technologies Used

- **Frontend**: React, TypeScript, Vite
- **Database**: Firebase Firestore
- **UI Components**: Radix UI, TailwindCSS
- **Charts**: Custom reusable chart components
- **State Management**: React Context API

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/erp-system-demo.git
   cd erp-system-demo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   - Create a Firebase project.
   - Add your Firebase configuration to `src/firebaseConfig.ts`.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open the application in your browser:
   ```
   http://localhost:3000
   ```

## Folder Structure

- **src/components**: Reusable UI components (e.g., forms, tables, charts).
- **src/pages**: Main application pages (e.g., Dashboard, Projects, Financials).
- **src/hooks**: Custom React hooks for Firestore integration.
- **src/lib**: Utility functions and configurations.
- **src/styles**: Global and component-specific styles.

## Key Components

### Dashboard
- Displays an overview of active projects and monthly costs.
- Includes a form to create new projects.

### Projects
- Manage all projects with filtering and sorting options.
- Create and edit project details.

### Financials
- Track expenses and invoices with detailed charts and tables.
- Group data by month and status for better visualization.

### Suppliers
- Manage supplier details and purchase orders.
- View onboarding progress and active suppliers.

### Users
- Add, edit, and manage user roles and permissions.
- Ensure secure collaboration within the system.

## Deployment

To deploy the application, build the project and host it on a platform like Vercel or Firebase Hosting:
```bash
npm run build
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License.
````
