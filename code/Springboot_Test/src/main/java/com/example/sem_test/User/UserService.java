package com.example.sem_test.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User FindByName(String name){
        List<User> u = userRepository.findByName(name);
        if(u!=null&&!u.isEmpty())
            return u.get(0);
        else
            return null;
    }

    public User FindByEmail(String email){
        List<User> u = userRepository.findByEmail(email);
        if(u!=null&&!u.isEmpty())
            return u.get(0);
        else
            return null;
    }

    public User Register(User u) { return userRepository.save(u); }

    public User LoginCheck(String name, String password){
        List<User> u = userRepository.findByName(name);
        if(u==null||u.isEmpty())
            return null;
        if(u.get(0).getPassword().equals(password))
            return u.get(0);
        else
            return null;
    }

    public User FindById(int id)
    {
        List<User> u = userRepository.findById(id);
        if(u==null||u.isEmpty())
            return null;
        else
            return u.get(0);
    }
}
