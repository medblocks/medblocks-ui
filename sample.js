s => {
    if (
    s["initial_assesment/glasgow_coma_scale_gcs:0/best_eye_response_e/value|ordinal"] 
    && s["initial_assesment/glasgow_coma_scale_gcs:0/best_verbal_response_v/value|ordinal"] 
    && s["initial_assesment/glasgow_coma_scale_gcs:0/best_motor_response_m/value|ordinal"]) {
        return s["initial_assesment/glasgow_coma_scale_gcs:0/best_eye_response_e/value|ordinal"] 
        + s["initial_assesment/glasgow_coma_scale_gcs:0/best_verbal_response_v/value|ordinal"] 
        + s["initial_assesment/glasgow_coma_scale_gcs:0/best_motor_response_m/value|ordinal"]
    }
}