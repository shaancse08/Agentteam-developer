using {devagent} from '../db/com.devagent';


service DeveloperService {
    entity Tasks    as projection on devagent.Tasks;
    entity TaskLogs as projection on devagent.TaskLogs;

    action submitTask(projectName: String,
                      taskDescription: String,
                      filePath: String) returns Boolean;


}
