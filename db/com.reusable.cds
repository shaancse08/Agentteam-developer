namespace com.reusable;


type Status    : String enum {
    received;
    in_progress;
    completed;
    failed;
}


type EventType : String enum {
    task_received;
    file_read;
    llm_call_started;
    llm_call_completed;
    code_written;
    error;
}
