# 🏋️‍♂️ Gym Management System

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A modern, responsive gym management system built with React and Vite. This application helps gym owners manage members, memberships, schedules, and more with an intuitive interface.

## 🚀 Features

- 📱 **Fully Responsive** design that works on all devices
- ⚡ **Blazing Fast** performance with Vite and React 18
- 🎨 **Modern UI** with smooth animations using Framer Motion
- 🔄 **Real-time Updates** for member check-ins and class schedules
- 📊 **Analytics Dashboard** to track gym performance
- 🔒 **Secure Authentication** with JWT

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router 6
- **Styling**: TailwindCSS, Hero Icons
- **Animations**: Framer Motion
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios
- **Date Handling**: date-fns

## 📁 Project Structure

```
src/
├── modules/                # Feature-based modules
│   ├── member/             # Member management
│   │   ├── components/     # Module-specific components
│   │   ├── pages/          # Route components
│   │   ├── hooks/          # Custom hooks
│   │   └── services/       # API services
│   │
│   ├── membership/        # Membership plans
│   ├── schedule/          # Class scheduling
│   └── dashboard/         # Analytics & reports
│
├── layout/               # Layout components
│   ├── Sidebar/          # Navigation sidebar
│   ├── Header/           # Top navigation
│   └── Footer/           # App footer
│
├── common/              # Shared UI components
│   ├── buttons/          # Button components
│   ├── forms/            # Form controls
│   ├── modals/           # Modal dialogs
│   └── tables/           # Data tables
│
├── context/             # Global state
│   ├── AuthContext.jsx   # Authentication state
│   └── ThemeContext.jsx  # Theme preferences
│
├── services/            # Global services
│   ├── api.js           # API configuration
│   └── auth.js          # Authentication service
│
├── utils/               # Helper functions
│   ├── validators/      # Form validation
│   └── formatters/      # Data formatting
│
├── assets/              # Static assets
│   ├── images/          # Image files
│   └── styles/          # Global styles
│
├── App.jsx             # Main app component
└── main.jsx             # App entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/gym-management-system.git
   cd gym-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/) for the amazing build tooling
- [TailwindCSS](https://tailwindcss.com/) for utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Hero Icons](https://heroicons.com/) for beautiful SVG icons
