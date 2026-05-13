import { createBrowserRouter } from 'react-router';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Materials } from './pages/Materials';
import { NewMaterial } from './pages/NewMaterial';
import { Movements } from './pages/Movements';
import { NewEntry } from './pages/NewEntry';
import { NewExit } from './pages/NewExit';
import { Reports } from './pages/Reports';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Login,
  },
  {
    path: '/dashboard',
    Component: Dashboard,
  },
  {
    path: '/materials',
    Component: Materials,
  },
  {
    path: '/materials/new',
    Component: NewMaterial,
  },
  {
    path: '/materials/edit/:id',
    Component: NewMaterial,
  },
  {
    path: '/movements',
    Component: Movements,
  },
  {
    path: '/movements/new-entry',
    Component: NewEntry,
  },
  {
    path: '/movements/new-exit',
    Component: NewExit,
  },
  {
    path: '/reports',
    Component: Reports,
  },
]);
