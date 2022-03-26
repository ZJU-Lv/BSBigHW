package com.example.sem_test.Task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface TaskRepository
        extends JpaRepository<Task, Integer> {
    public List<Task> findById(int id);
    public List<Task> findByReceiverid(int receiverid);
    public List<Task> findByCreatorid(int creatorid);

    @Modifying
    @Transactional
    @Query(value="update Task t set t.isreceived=true, t.receiverid=:receiverId where t.id=:taskId")
    public int receiveTask(@Param("taskId") int taskId, @Param("receiverId") int receiverId);

    @Modifying
    @Transactional
    @Query(value="update Task t set t.isfinished=true where t.id=:taskId")
    public int submitTask(@Param("taskId") int taskId);
}
