# 🎡 Wheel of Life - Life Satisfaction Assessment

A beautiful, interactive life satisfaction assessment tool that helps users (ages 16-24) visualize their life satisfaction across different life domains. Built with Next.js 16, React 19, and Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)

## ✨ Features

- **Interactive Assessment** - Rate your satisfaction across 7 life domains:
  - 👨‍👩‍👧‍👦 Family
  - 👥 Friends
  - 📚 School
  - 💼 Work
  - 🏠 Living Space
  - 💭 Self
  - ✨ Overall Life

- **Visual Results** - See your responses displayed as an animated wheel chart
- **Responsive Design** - Works beautifully on desktop and mobile devices
- **Accessible** - Built with accessibility in mind using Radix UI components

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18.x or higher recommended)
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository** (if you haven't already):

   ```bash
   git clone <repository-url>
   cd Wheel-of-Life
   ```

2. **Navigate to the app directory**:

   ```bash
   cd wheel-of-life
   ```

3. **Install dependencies**:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

### Running the Development Server

Start the development server with hot-reload:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

Create an optimized production build:

```bash
npm run build
```

Then start the production server:

```bash
npm run start
```

### Linting

Run ESLint to check for code issues:

```bash
npm run lint
```

## 📁 Project Structure

```
wheel-of-life/
├── app/
│   ├── page.tsx        # Main assessment page
│   ├── layout.tsx      # Root layout
│   ├── globals.css     # Global styles
│   └── favicon.ico
├── components/
│   └── ui/             # Reusable UI components (shadcn/ui)
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── input.tsx
│       └── label.tsx
├── lib/
│   └── utils.ts        # Utility functions
├── public/             # Static assets
├── package.json
└── tsconfig.json
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/) with Radix UI primitives
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) with Zod validation
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)

## 📄 License

This project is private and not licensed for public distribution.

---

Made with ❤️ for the Future Coach program

