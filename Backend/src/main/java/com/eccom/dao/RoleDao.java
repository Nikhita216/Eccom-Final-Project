package com.eccom.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.eccom.entity.Role;

@Repository
public interface RoleDao extends CrudRepository<Role, String> {

}
