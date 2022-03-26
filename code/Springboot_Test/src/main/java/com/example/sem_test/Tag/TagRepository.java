package com.example.sem_test.Tag;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface TagRepository
        extends JpaRepository<Tag, Integer> {
    public List<Tag> findByImageid(int imageid);

    @Modifying
    @Transactional
    @Query(value="delete from Tag where uuid=:UUId")
    void deleteTag(@Param("UUId") String UUid);

    @Modifying
    @Transactional
    @Query(value="update Tag t set t.name=:newName, t.x=:newX, t.y=:newY, t.xm=:newXm, t.ym=:newYm where t.uuid=:UUId")
    public int changeTag(@Param("UUId") String UUId, @Param("newName") String newName, @Param("newX") String newX, @Param("newY") String newY, @Param("newXm") String newXm, @Param("newYm") String newYm);
}
