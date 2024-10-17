import {createRoot} from 'react-dom/client';
import Router from './router.tsx';
import '@topihenrik/funktia/dist/index.css';
import './main.css';

createRoot(document.getElementById('root')!).render(<Router />);
