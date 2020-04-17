<?php
/**
Plugin Name: Caldera Forms Bing Integration
Description: Adds Bing Maps API to caldera.
Version: 0.1-alpha2
Author: Zack Palmer (zacnoo)
*/

add_action( 'wp_enqueue_scripts', 'caldera_bing_loader' );
function caldera_bing_loader(){
  wp_enqueue_script( 'caldera_bing_integration.js', plugin_dir_url( __FILE__ ) . '/js', array( 'jquery' ) );
}

?>