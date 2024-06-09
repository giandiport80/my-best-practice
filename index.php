<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Sample extends CI_Controller
{
    protected function _validate()
    {
        $this->config->set_item('language', 'indonesian');
        $this->lang->load('form_validation', 'indonesian');

        $this->form_validation->set_rules('nama', 'Nama', 'trim|required|strip_tags');

        if ($this->form_validation->run()) return TRUE;

        $data = $error = array();
        $data['error_class'] = $data['error_string'] = array();
        $data['success'] = true;

        if (form_error('area')) $error[] = 'area';

        if ($error) {
            foreach ($error as $row) {
                $data['error_class'][] = $row;
                $data['error_string'][] = strip_tags(form_error($row));
            }

            $data['success'] = false;
            $data["message"] = "Periksa kembali kolom inputan anda";
            $data["errors"] = true;

            http_response_code(400);
            header("Content-Type: application/json");
            echo json_encode($data);
            exit();
        }
    }
}
