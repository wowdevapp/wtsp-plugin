<?php

/**
 * Plugin Name: Wtsp Plugin
 * Plugin URI: https://example.com
 * Description: My awesome plugin description
 * Version: 1.0.0
 * Author: Fouad Abdelhaq
 * Text Domain: my-plugin
 */

if (!defined('ABSPATH')) exit;
require_once plugin_dir_path(__FILE__) . 'includes/class-settings.php';
require_once plugin_dir_path(__FILE__) . 'includes/class-frontend.php';
class MyPlugin
{
    private $version = '1.0.0';
    private $plugin_name = 'my-plugin';
    private $settings;
    private $frontend;

    public function __construct()
    {
        add_action('init', array($this, 'init'));
        add_action('admin_menu', array($this, 'add_menu_page'));
        $this->settings = new MyPlugin_Settings();
        $this->frontend = new MyPlugin_Frontend();
        register_uninstall_hook(
            __FILE__,
            array('MyPlugin', 'uninstall')
        );

        register_deactivation_hook(
            __FILE__,
            array($this, 'deactivate')
        );
    }

    public function init()
    {
        load_plugin_textdomain($this->plugin_name, false, dirname(plugin_basename(__FILE__)) . '/languages');
    }

    public function add_menu_page()
    {
        $hook_suffix = add_menu_page(
            __('Wtsp Plugin', $this->plugin_name),
            __('Wtsp Plugin', $this->plugin_name),
            'manage_options',
            $this->plugin_name,
            array($this, 'render_app'),
            'dashicons-whatsapp'
        );

        add_action("admin_print_scripts-{$hook_suffix}", array($this, 'enqueue_admin_scripts'));
    }

    public function render_app()
    {
        echo '<div id="my-plugin-root"></div>';
    }

    public function enqueue_admin_scripts()
    {
        $asset_file = include plugin_dir_path(__FILE__) . 'build/index.asset.php';

        wp_enqueue_script(
            $this->plugin_name,
            plugin_dir_url(__FILE__) . 'build/index.js',
            $asset_file['dependencies'],
            $asset_file['version'],
            true
        );

        wp_enqueue_style(
            $this->plugin_name,
            plugin_dir_url(__FILE__) . 'build/index.css',
            array(),
            $this->version
        );

        wp_localize_script($this->plugin_name, 'myPluginData', array(
            'nonce' => wp_create_nonce('wp_rest'),
            'apiUrl' => rest_url('my-plugin/v1/')
        ));
    }


    public static function uninstall()
    {
        // Delete plugin options
        delete_option('my_plugin_settings');

        // Clean up any additional plugin data
        global $wpdb;

        // Clear cache
        wp_cache_flush();

        // Delete any plugin-specific user meta
        $wpdb->query("DELETE FROM {$wpdb->usermeta} WHERE meta_key LIKE 'my_plugin_%'");
    }

    /**
     * Plugin deactivation tasks
     */
    public function deactivate()
    {
        // Clear any scheduled events
        wp_clear_scheduled_hook('my_plugin_daily_event');

        // Clear any transients
        delete_transient('my_plugin_cache');

        // Log deactivation (optional)
        error_log('My Plugin deactivated');
    }
}

new MyPlugin();
