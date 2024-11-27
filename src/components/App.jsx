// src/components/App.js
import { SettingsProvider } from '../context/SettingsContext';
import SettingsForm from './SettingsForm';

export default function App() {
    return (
        <SettingsProvider>
            <div className="my-plugin-settings-page">
                <SettingsForm />
            </div>
        </SettingsProvider>
    );
}