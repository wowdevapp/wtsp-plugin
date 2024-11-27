<?php
class MyPlugin_Settings
{
    private $option_name = 'my_plugin_settings';

    public function __construct()
    {
        add_action('rest_api_init', array($this, 'register_settings_endpoints'));
        add_action('admin_init', array($this, 'register_settings'));
    }

    public function register_settings()
    {
        register_setting(
            $this->option_name,
            $this->option_name,
            array(
                'type' => 'object',
                'default' => array(
                    'whatsapp_number' => '',
                    'whatsapp_message' => 'Hello, I would like to chat with you!',
                    'button_color' => '#25D366', // WhatsApp green
                    'button_position' => 'right',
                    'button_size' => 'medium',
                    'show_on_mobile' => true,
                    'show_on_desktop' => true
                )
            )
        );
    }

    public function register_settings_endpoints()
    {
        register_rest_route('my-plugin/v1', '/settings', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_settings'),
                'permission_callback' => array($this, 'check_permission')
            ),
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'update_settings'),
                'permission_callback' => array($this, 'check_permission')
            )
        ));
    }

    public function check_permission()
    {
        return current_user_can('manage_options');
    }

    public function get_settings()
    {
        return rest_ensure_response(get_option($this->option_name));
    }

    public function update_settings($request)
    {
        $settings = $request->get_json_params();
        $updated = update_option($this->option_name, $settings);

        if ($updated) {
            return rest_ensure_response(get_option($this->option_name));
        }

        return new WP_Error(
            'settings_update_failed',
            'Failed to update settings',
            array('status' => 500)
        );
    }
}
