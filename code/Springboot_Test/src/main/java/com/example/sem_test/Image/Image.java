package com.example.sem_test.Image;

import javax.persistence.*;

@Entity
@Table
public class Image {
    @Id
    @SequenceGenerator(
            name = "image_sequence",
            sequenceName = "image_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "image_sequence"
    )
    private int id;
    private String name;
    private int taskid;

    public Image(){
    }

    public Image(String name, int taskid) {
        this.name = name;
        this.taskid = taskid;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getTaskid() {
        return taskid;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setTaskid(int taskid) {
        this.taskid = taskid;
    }
}
