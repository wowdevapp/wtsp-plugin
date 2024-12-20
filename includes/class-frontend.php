<?php

class MyPlugin_Frontend
{
    public function __construct()
    {
        add_action('wp_footer', array($this, 'render_whatsapp_button'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_assets'));
    }

    public function enqueue_frontend_assets()
    {
        wp_enqueue_style(
            'my-plugin-frontend',
            plugin_dir_url(dirname(__FILE__)) . 'assets/css/frontend.css',
            array(),
            '1.0.0'
        );
    }

    public function render_whatsapp_button()
    {
        $settings = get_option('my_plugin_settings');

        if (empty($settings['whatsapp_number'])) {
            return;
        }

        // Clean phone number
        $phone_number = preg_replace('/[^0-9]/', '', $settings['whatsapp_number']);

        // Build WhatsApp URL
        $whatsapp_url = sprintf(
            'https://wa.me/%s?text=%s',
            $phone_number,
            urlencode($settings['whatsapp_message'])
        );

        $position_class = 'whatsapp-btn-' . $settings['button_position'];
        $size_class = 'whatsapp-btn-' . $settings['button_size'];

        // Check device display settings
        $display = true;
        if (wp_is_mobile() && !$settings['show_on_mobile']) {
            $display = false;
        }
        if (!wp_is_mobile() && !$settings['show_on_desktop']) {
            $display = false;
        }

        if ($display) {
?>
            <a href="<?php echo esc_url($whatsapp_url); ?>"
                target="_blank"
                rel="noopener noreferrer"
                class="whatsapp-btn <?php echo esc_attr($position_class); ?> <?php echo esc_attr($size_class); ?>"
                style="background-color: <?php echo esc_attr($settings['button_color']); ?>">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034l-1.49 4.477a.75.75 0 00.934.934l4.477-1.49A11.925 11.925 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.389 0-4.6-.74-6.43-2.004a.75.75 0 00-.654-.088l-3.162 1.054.98-2.94a.75.75 0 00-.088-.654A9.94 9.94 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z" />
                </svg>
            </a>
<?php
        }
    }
}
