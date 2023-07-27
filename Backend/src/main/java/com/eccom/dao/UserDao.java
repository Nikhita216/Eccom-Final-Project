package com.eccom.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.eccom.entity.User;

@Repository
public interface UserDao extends CrudRepository<User, String> {
}
