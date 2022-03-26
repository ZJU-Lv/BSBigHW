package com.example.sem_test.Image;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ImageService {
    private final ImageRepository imageRepository;

    @Autowired
    public ImageService(ImageRepository imageRepository){ this.imageRepository = imageRepository; }

    public void SaveImage(String name, int taskid){
        Image i = new Image(name, taskid);
        imageRepository.save(i);
    }

    public List<Image> FindByTaskid(int taskid) { return imageRepository.findByTaskid(taskid); }
}
