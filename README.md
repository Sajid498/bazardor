
# BazarDor (বাজার দর)

BazarDor is a responsive web application for checking the latest prices of daily essential products in Bangladesh. Users can explore product categories, track price changes, compare market prices, and view detailed product information.

## Features

1. **Latest Market Prices:** View updated prices of daily essential products, including rice, lentils, oil, vegetables, fish, meat, eggs, milk, and spices.

2. **Price Increase and Decrease:** Explore the top 6 products with the highest price increases and the top 6 products with the highest price decreases.

3. **Category-Based Browsing:** Browse products by category and sort them by price from low to high or high to low.

4. **Detailed Product Information:** View product prices, price changes, minimum, maximum, and average prices, along with market-specific price information.

5. **User Authentication:** Sign up and sign in using email and password, Google, or GitHub through Better Auth.

6. **Protected Product Details:** Product detail pages require authentication. Unauthenticated users are redirected to the sign-in page.

7. **User Profile Management:** View account information and update the profile name using Better Auth.

8. **Responsive Design:** The website is designed for mobile, tablet, and desktop devices.

9. **Bangla Price Display:** Product prices and price changes are displayed using Bengali numerals.

10. **Live Price Ticker:** A scrolling ticker in the navigation area highlights product prices and changes.

## Technologies Used

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Better Auth
- PostgreSQL (Neon)
- React Hot Toast
- External BazarDor Product API

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Sajid498/bazardor.git
cd bazardor
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root.

```env
DATABASE_URL=your_postgresql_connection_string

BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

Replace the placeholder values with your own credentials.

Never commit `.env.local` or actual credentials to GitHub.

### 4. Start the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 5. Build for production

```bash
npm run build
npm run start
```

## Main Routes

| Route | Description |
|---|---|
| `/` | Home page with product prices and trends |
| `/category/[slug]` | Category-based product listing |
| `/product/[slug]` | Protected product details |
| `/signin` | User sign-in |
| `/signup` | User registration |
| `/my-profile` | User profile |
| `/my-profile/update` | Update profile information |

## Deployment

The application is designed to be deployed on a Next.js-compatible hosting platform such as Netlify or Vercel.

**Live Website:** Add your deployed website URL here.

## GitHub Repository

https://github.com/Sajid498/bazardor
