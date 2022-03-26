package com.example.sem_test.Task;

import javax.persistence.*;

@Entity
@Table
public class Task {
    @Id
    @SequenceGenerator(
            name = "task_sequence",
            sequenceName = "task_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "task_sequence"
    )
    private int id;
    private int creatorid;
    private String name;
    private String requirement;
    private boolean isreceived;
    private int receiverid;
    private boolean isfinished;

    public Task(){
    }

    public Task(int creator_id, String name, String requirement) {
        this.creatorid = creator_id;
        this.name = name;
        this.requirement = requirement;
        this.isreceived = false;
        this.receiverid = -1;
        this.isfinished = false;
    }

    public int getId() {
        return id;
    }

    public int getCreatorid(){
        return creatorid;
    }

    public String getName() {
        return name;
    }

    public String getRequirement() {
        return requirement;
    }

    public boolean isIsreceived() {
        return isreceived;
    }

    public int getReceiverid() {
        return receiverid;
    }

    public boolean isIsfinished() {
        return isfinished;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setRequirement(String requirement) {
        this.requirement = requirement;
    }

    public void setIsreceived(boolean is_received) {
        this.isreceived = is_received;
    }

    public void setReceiverid(int receiver_id) {
        this.receiverid = receiver_id;
    }

    public void setIsfinished(boolean is_finished) {
        this.isfinished = is_finished;
    }
}
