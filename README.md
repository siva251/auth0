# Getting Started with Create React App

This project is React application that uses Redux Toolkit for state management, React-Router for Routing and Tailwind for Cosmetics.

## Project Structure

src_extracted/
 └── src/
     ├── App.css
     ├── App.js
     ├── index.css
     ├── index.js
     ├── app/
     │   └── store.js
     ├── auth/
     │   ├── authSlice.js
     │   └── themeSlice.js
     └── components/
         ├── Loading.js
         ├── Login.js
         ├── ProtectedRoute.js
         ├── ThemeToggle.js
         └── Welcome.js


### Tech Stack

React.js (CRA) – Frontend framework

Redux Toolkit – State management

React Router – Routing and navigation

### Usage

Run the app → You’ll see the Login page.

Enter credentials to log in.

After successful login, you’ll be redirected to the Welcome page.

Use the Theme Toggle to switch between light/dark modes.

Protected routes are only accessible when logged in.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.
