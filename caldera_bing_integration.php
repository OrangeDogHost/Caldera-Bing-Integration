<?php
/**
Plugin Name: Caldera Forms Bing Integration
Description: Adds Bing Maps API to caldera.
Version: 0.1-alpha2
Author: Zack Palmer (zacnoo)
*/

add_action( 'wp_enqueue_scripts', 'my_custom_script_load' );
function my_custom_script_load(){
  wp_enqueue_script( 'my-custom-script', plugin_dir_url( __FILE__ ) . '/js/bookingform.js', array( 'jquery' ) );
}

?>