import { render } from '@wordpress/element';
import App from './components/App';
import './styles/main.css';

render(
    <App />,
    document.getElementById('my-plugin-root')
);