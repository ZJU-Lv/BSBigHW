package com.example.sem_test.Task;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TaskService {
    private final TaskRepository taskRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository){ this.taskRepository = taskRepository; }

    public Task SaveTask(int creatorid, String name, String requirement){
        Task t = new Task(creatorid, name, requirement);
        return taskRepository.save(t);
    }

    public List<Task> FindAllTask(){ return taskRepository.findAll(); }
    public Task FindById(int id){
        List<Task> t = taskRepository.findById(id);
        if(t!=null&&!t.isEmpty())
            return t.get(0);
        else
            return null;
    }

    public void ReceiveTask(int taskId, int receiverId){
        taskRepository.receiveTask(taskId, receiverId);
    }
    public List<Task> FindByReceiverid(int receiverid){
        return taskRepository.findByReceiverid(receiverid);
    }
    public List<Task> FindByCreatorid(int creatorid){
        return taskRepository.findByCreatorid(creatorid);
    }

    public void SubmitTask(int taskId){
        taskRepository.submitTask(taskId);
    }
}
