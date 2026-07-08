namespace devagent;

using {
    com.reusable.Status,
    com.reusable.EventType
} from './com.reusable';
using {
    managed,
    cuid
} from '@sap/cds/common';


entity Tasks : cuid, managed {
    projectName     : String;
    taskDescription : String;
    filePath        : String;
    status          : Status default 'received';
    generatedCode   : LargeString;
    explanation     : LargeString;
    errorMessage    : LargeString;
    logs            : Composition of many TaskLogs
                          on logs.task = $self;
}

entity TaskLogs : cuid, managed {
    task      : Association to Tasks;
    eventType : EventType;
    detail    : LargeString;
}
