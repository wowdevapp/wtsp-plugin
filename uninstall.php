<?
if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

// Your uninstall code
function my_plugin_uninstall()
{
    // Delete plugin options
    delete_option('my_plugin_settings');

    // Clean up database - remove any custom tables if your plugin created any
    global $wpdb;

    // Example if you had created custom tables:
    // $wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}my_plugin_table");

    // Clear any scheduled cron events
    wp_clear_scheduled_hook('my_plugin_daily_event');

    // Clear any transients
    delete_transient('my_plugin_cache');
}

my_plugin_uninstall();
