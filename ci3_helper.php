<?php

/**
 * Codeigniter 3
 * mengambil input post dengan htmlspecialchars
 *
 * @param string $keys
 * 
 */
function request_post($keys = null)
{
    $CI = &get_instance();

    $post_data = $CI->input->post(null, true);

    if ($keys == null) {
        foreach ($post_data as $key => $value) {
            $post_data[$key] = htmlspecialchars($value);
        }
    } else {
        if (isset($post_data[$keys])) {
            $post_data[$keys] = htmlspecialchars($post_data[$keys]);
        }
    }

    return $post_data;
}

/**
 * Codeigniter 3
 * mengambil input get dengan htmlspecialchars
 *
 * @param string $keys
 * 
 */
function request_get($keys = null)
{
    $CI = &get_instance();

    $post_data = $CI->input->get(null, true);

    if ($keys == null) {
        foreach ($post_data as $key => $value) {
            $post_data[$key] = htmlspecialchars($value);
        }
    } else {
        if (isset($post_data[$keys])) {
            $post_data[$keys] = htmlspecialchars($post_data[$keys]);
        }
    }

    return $post_data;
}

/**
 * redirect intended for codeigniter 3
 *
 * @param string $default_url
 */
function redirect_intended($default_url)
{
    $CI = &get_instance();
    $redirect_url = $CI->session->userdata("redirect_url");

    if ($CI->session->userdata("redirect_url") != null) {
        $CI->session->set_userdata('redirect_url', null);

        redirect($redirect_url);
    } else {
        redirect($default_url);
    }
}



