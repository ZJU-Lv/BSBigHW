package com.example.sem_test.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.support.SimpleTriggerContext;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TagService {
    private final TagRepository tagRepository;

    @Autowired
    public TagService(TagRepository tagRepository){ this.tagRepository = tagRepository; }

    public Tag SaveTag(String uuid, String name, String x, String y, String xm, String ym, int taskid, int imageid){
        Tag t = new Tag(uuid, name, x, y, xm, ym, taskid, imageid);
        return tagRepository.save(t);
    }

//    public void DeleteTag(String uuid, String name, String x, String y, String xm, String ym, int taskid, int imageid){
//        Tag t = new Tag(uuid, name, x, y, xm, ym, taskid, imageid);
//        tagRepository.delete(t);
//    }
    public void DeleteTag(String uuid){
        tagRepository.deleteTag(uuid);
    }

    public void ChangeTag(String uuid, String name, String x, String y, String xm, String ym)
    {
        tagRepository.changeTag(uuid, name, x, y, xm, ym);
    }

    public List<Tag> FindByImageid(int imageid){
        return tagRepository.findByImageid(imageid);
    }
}
