import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import store from "@src/Store/store.ts";
import {Provider} from "react-redux";

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);
