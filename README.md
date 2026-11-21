# GearVault - Equipment Rental Platform

## Live URL
- **Development:** https://gear-vault-lilac.vercel.app
- **Backend API:** https://gear-vault-server.vercel.app

## Project Overview
GearVault is a full-stack equipment rental platform built with Next.js 16.4.6 (App Router + TypeScript + Turbopack), connected to a MongoDB backend via Better Auth for authentication. The platform allows equipment owners to list their gear and customers to rent equipment, with image uploads, role-based access control, and a complete booking system.

## Key Features

### Authentication & Authorization
- **Email/password registration** with role selection (customer/owner)
- **Google OAuth login** integration
- **Role-based access control**:
  - Customers: favorite/book equipment, view profile
  - Owners: add/edit their own equipment, view stats
  - Admins: full access to all equipment and users
- **Session management** with JWT cookies and 7-day cache

### Image Upload
- **Computer-to-imgbb upload** (no base64 in JSON)
- **5 MB size limit** with client validation
- **Image preview** with remove functionality
- **Optional profile photos** on registration
- API key configured via `NEXT_PUBLIC_IMGBB_API_KEY` in `.env`

### Equipment Management
- **Add equipment** with category, condition, price, quantity, location
- **Status flow**: Pending → Approved (admin review)
- **Public listing** only shows Approved equipment
- **Search/filter** by category, condition, rental type, location, price range
- **Availability tracking** with quantity management

### Booking System
- **Create bookings** with start/end dates and quantity
- **Stripe payment integration** for rental payments
- **Booking completion cron job** automates status changes
- **Owner rentals view** - see bookings for their equipment
- **Customer rentals view** - see their active bookings

### Dashboard & Statistics
- **Owner dashboard**: equipment stats, pending approvals, earnings
- **Admin dashboard**: total users, equipment, bookings, revenue
- **Monthly charts** for bookings and earnings
- **Pending approvals** management queue

### Public Features
- **Home page** with featured equipment carousel
- **All equipment** list with filtering and search
- **Category browsing** and equipment details page
- **Contact page** with static information

## Tech Stack

### Frontend
- **Next.js 16.4.6** with App Router and Turbopack
- **TypeScript 5** for type safety
- **React 19** with React Compiler
- **Tailwind CSS 4** with custom dark theme
- **shadcn/ui** component library
- **lucide-react** for icons
- **framer-motion** for animations
- **next-themes** for dark mode support

### Backend
- **Better Auth** for authentication (with MongoDB adapter)
- **MongoDB Atlas** for database
- **Node-cron** for scheduled tasks (booking completion)
- **Stripe** for payment processing
- **Mongoose** for MongoDB ODM

### Key npm Packages
| Package | Purpose |
|---------|---------|
| `next` | 16.4.6 - React framework |
| `react` | 19.3.0 - UI library |
| `react-dom` | 19.3.0 - DOM rendering |
| `better-auth` | 1.7.25 - Authentication service |
| `@better-auth/mongo-adapter` | 1.7.25 - MongoDB adapter |
| `mongodb` | 7.9.0 - MongoDB driver |
| `tailwindcss` | 4.3.3 - CSS framework |
| `@tailwindcss/turbopack` | 4.3.3 - Turbopack integration |
| `lucide-react` | 1.74.0 - Icon library |
| `framer-motion` | 14.14.0 - Animations |
| `shadcn-react` | 0.3.1 - UI components |
| `stripe` | Latest - Payment processing |
| `bcrypt` / `jwt` | Authentication security |

## Project Structure

```
src/app/          # Next.js App Router pages
src/components/   # Reusable UI components
src/lib/          # Utilities (auth.ts, api/fetch.ts)
src/types/        # TypeScript type definitions
src/constants/    # Application constants
src/hooks/        # Custom React hooks
src/utils/        # Helper functions
server/index.js   # Express/Node.js backend API
```

## Development

### Prerequisites
- Node.js 20+
- MongoDB Atlas account
- Stripe account (for payments)
- Imgbb API key (for image uploads)

### Environment Variables
Create `.env` file:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_key_here
BETTER_AUTH_SECRET=your_random_secret
BETTER_AUTH_URL=http://localhost:3000
DB_URI=mongodb://username:password@cluster.mongodb.net/gear-vault
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Running Development
```bash
# Start backend
cd gear-vault-server
node index.js

# Start frontend
cd gear-vault
npm run dev
```

### Build & Production
```bash
npm run build
npm run start
```

## Role Rules
- **Customers**: Can favorite/book equipment, view their profile and rentals
- **Owners**: Can add/edit their own equipment, view their stats and rentals
- **Admins**: Full access to all equipment, users, and stats management

## Known Issues & Notes
- Image uploads use imgbb's client-side API (key is exposed in browser bundle, which is expected for this service)
- Equipment requires admin approval (status: Pending → Approved) before appearing publicly
- Google social login requires proper OAuth configuration in Google Cloud Console
- The platform uses Turbopack for development speed (may show HMR-related warnings that are normal)