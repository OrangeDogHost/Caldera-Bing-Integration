<?php
/**
Plugin Name: Caldera Forms Bing Integration
Description: Adds Bing Maps API to caldera.
Version: 0.1-alpha3
Author: Zack Palmer (zacnoo)
*/

add_action( 'wp_enqueue_scripts', 'caldera_bing_loader' );
function caldera_bing_loader(){
  wp_enqueue_script("jquery");
  wp_enqueue_script( 'caldera_bing_integration', plugin_dir_url( __FILE__ ) . '/js/caldera_bing_integration.js', array('jquery') );
}

?>