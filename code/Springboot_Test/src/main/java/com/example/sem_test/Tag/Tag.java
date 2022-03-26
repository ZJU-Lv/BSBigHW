package com.example.sem_test.Tag;

import javax.persistence.*;

@Entity
@Table
public class Tag {
    @Id
    @SequenceGenerator(
            name = "tag_sequence",
            sequenceName = "tag_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "tag_sequence"
    )
    private int id;
    private String uuid;
    private String name;
    private String x;
    private String y;
    private String xm;
    private String ym;
    private int taskid;
    private int imageid;

    public Tag(){

    }

    public Tag(String uuid, String name, String x, String y, String xm, String ym, int taskid, int imageid) {
        this.uuid = uuid;
        this.name = name;
        this.x = x;
        this.y = y;
        this.xm = xm;
        this.ym = ym;
        this.taskid = taskid;
        this.imageid = imageid;
    }

    public int getId() {
        return id;
    }

    public String getUuid() {
        return uuid;
    }

    public String getName() {
        return name;
    }

    public String getX() {
        return x;
    }

    public String getY() {
        return y;
    }

    public String getXm() {
        return xm;
    }

    public String getYm() {
        return ym;
    }

    public int getTaskid() {
        return taskid;
    }

    public int getImageid() {
        return imageid;
    }
}
