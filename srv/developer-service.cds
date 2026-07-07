using {devagent} from '../db/com.devagent';


service DeveloperService {
    entity Tasks    as projection on devagent.Tasks;
    entity TaskLogs as projection on devagent.TaskLogs;


}
