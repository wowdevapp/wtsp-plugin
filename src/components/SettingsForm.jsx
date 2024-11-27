// src/components/SettingsForm.js
import { useState } from '@wordpress/element';
import { 
    Button, 
    Card, 
    CardHeader, 
    CardBody, 
    TextControl, 
    ToggleControl,
    Notice,
    TextareaControl,
    ColorPicker,
    SelectControl
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSettings } from '../context/SettingsContext';

export default function SettingsForm() {
    const { settings, loading, error, updateSettings ,setSettings} = useSettings();
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    if (loading) {
        return <div>Loading settings...</div>;
    }

    if (error) {
        return <Notice status="error">{error}</Notice>;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSaving(true);
        setSaveMessage('');

        const result = await updateSettings(settings);
        
        setIsSaving(false);
        setSaveMessage(result.success ? 'Settings saved successfully!' : 'Failed to save settings');
        
        setTimeout(() => {
            setSaveMessage('');
        }, 3000);
    };

    const updateSetting = (key, value) => {
        setSettings({
            ...settings,
            [key]: value
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <h2>{__('WhatsApp Button Settings', 'my-plugin')}</h2>
                </CardHeader>
                <CardBody>
                    <TextControl
                        label={__('WhatsApp Number', 'my-plugin')}
                        help={__('Include country code (e.g., +1234567890)', 'my-plugin')}
                        value={settings.whatsapp_number}
                        onChange={(value) => updateSetting('whatsapp_number', value)}
                    />
                    
                    <TextareaControl
                        label={__('Default Message', 'my-plugin')}
                        help={__('Message that will be pre-filled in WhatsApp', 'my-plugin')}
                        value={settings.whatsapp_message}
                        onChange={(value) => updateSetting('whatsapp_message', value)}
                    />

                    <div className="color-picker-field">
                        <label>{__('Button Color', 'my-plugin')}</label>
                        <ColorPicker
                            color={settings.button_color}
                            onChangeComplete={(color) => updateSetting('button_color', color.hex)}
                        />
                    </div>

                    <SelectControl
                        label={__('Button Position', 'my-plugin')}
                        value={settings.button_position}
                        options={[
                            { label: 'Right', value: 'right' },
                            { label: 'Left', value: 'left' }
                        ]}
                        onChange={(value) => updateSetting('button_position', value)}
                    />

                    <SelectControl
                        label={__('Button Size', 'my-plugin')}
                        value={settings.button_size}
                        options={[
                            { label: 'Small', value: 'small' },
                            { label: 'Medium', value: 'medium' },
                            { label: 'Large', value: 'large' }
                        ]}
                        onChange={(value) => updateSetting('button_size', value)}
                    />

                    <ToggleControl
                        label={__('Show on Mobile', 'my-plugin')}
                        checked={settings.show_on_mobile}
                        onChange={(value) => updateSetting('show_on_mobile', value)}
                    />

                    <ToggleControl
                        label={__('Show on Desktop', 'my-plugin')}
                        checked={settings.show_on_desktop}
                        onChange={(value) => updateSetting('show_on_desktop', value)}
                    />

                    <Button 
                        isPrimary
                        type="submit"
                        isBusy={isSaving}
                    >
                        {__('Save Settings', 'my-plugin')}
                    </Button>
                </CardBody>
            </Card>
        </form>
    );
}