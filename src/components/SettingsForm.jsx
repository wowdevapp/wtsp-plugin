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
                        label={__('Default Message for Visitors', 'my-plugin')}
                        help={__('This message will be pre-filled when visitors click the WhatsApp button', 'my-plugin')}
                        value={settings.whatsapp_message}
                        onChange={(value) => updateSetting('whatsapp_message', value)}
                        placeholder="Hello, I would like to chat with you!"
                    />
                    
                    <TextareaControl
                        label={__('Default Visitor Message', 'my-plugin')}
                        help={__('This message will be pre-filled for the visitor to send', 'my-plugin')}
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
            <Card>
                <CardHeader>
                    <h2>{__('Data Management', 'my-plugin')}</h2>
                </CardHeader>
                <CardBody>
                    <ToggleControl
                        label={__('Remove all data when uninstalling plugin', 'my-plugin')}
                        help={__('When enabled, all plugin settings will be removed upon uninstall', 'my-plugin')}
                        checked={settings.remove_data_on_uninstall}
                        onChange={(value) => updateSetting('remove_data_on_uninstall', value)}
                    />

                    <div className="data-removal-section">
                        <h3>{__('Remove Data Now', 'my-plugin')}</h3>
                        <p className="description">
                            {__('This will immediately remove all plugin data. This action cannot be undone.', 'my-plugin')}
                        </p>
                        <Button 
                            isDestructive
                            onClick={() => {
                                if (window.confirm(__('Are you sure you want to remove all plugin data? This cannot be undone.', 'my-plugin'))) {
                                    // Call your data removal endpoint
                                    updateSettings({});
                                }
                            }}
                        >
                            {__('Remove All Data', 'my-plugin')}
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </form>
    );
}