namespace com.reusable;


type Status    : String enum {
    received;
    in_progress;
    completed;
    failed;
}


type EventType : String enum {
    files_listed;
    files_selected;
    file_read;
    llm_call_started;
    llm_call_completed;
    code_written;
    command_executed;
    command_result;
    error;
}
