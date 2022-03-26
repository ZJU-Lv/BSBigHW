package com.example.sem_test.User;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface UserRepository
        extends JpaRepository<User, Integer> {
    public List<User> findById(int id);
    public List<User> findByName(String name);
    public List<User> findByEmail(String email);
    public List<User> findByNameAndPassword(String name, String password);
    public List<User> findByNameAndPasswordNotLike(String name, String locked_string);

//    @Modifying
//    @Transactional
//    @Query(value="update User u set u.name=:newName, u.password=:newPassword, u.email=:newEmail, u.phone=:newPhone, u.country=:newCountry, u.birthday=:newBirthday, u.age=:newAge, u.intro=:newIntro where u.id=:oldId")
//    public int updateById(@Param("oldId") int id, @Param("newName") String newName, @Param("newPassword") String newPassword, @Param("newEmail") String newEmail,
//                        @Param("newPhone") String newPhone, @Param("newCountry") String newCountry,
//                        @Param("newBirthday") String newBirthday, @Param("newAge") String newAge, @Param("newIntro") String newIntro);
//
//    @Modifying
//    @Transactional
//    @Query(value="update User u set u.name=:newName where u.id=0")
//    public int updateLoginUser(@Param("newName") String newName);
}
