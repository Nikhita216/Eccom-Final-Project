package com.eccom.service;

import com.eccom.configuration.JwtRequestFilter;
import com.eccom.dao.RoleDao;
import com.eccom.dao.UserDao;
import com.eccom.entity.Role;
import com.eccom.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class UserService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private RoleDao roleDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void initRoleAndUser() {

        Role adminRole = new Role();
        adminRole.setRoleName("Admin");
        adminRole.setRoleDescription("Admin role");
        roleDao.save(adminRole);

        Role userRole = new Role();
        userRole.setRoleName("User");
        userRole.setRoleDescription("Default role for newly created record");
        roleDao.save(userRole);

        User adminUser = new User();
        adminUser.setUserName("seller");
        adminUser.setUserPassword(getEncodedPassword("seller@pass"));
        adminUser.setUserFullName("seller seller");
        adminUser.setUserAddress("Mumbai Maharashtra");
        adminUser.setMobileNumber(9999999999l);
        Set<Role> adminRoles = new HashSet<>();
        adminRoles.add(adminRole);
        adminUser.setRole(adminRoles);
        userDao.save(adminUser);

		
		  User user = new User(); 
		  user.setUserName("Nikhita");
		  user.setUserPassword(getEncodedPassword("Nikhita@123"));
		  user.setUserFullName("Nikhita Thipe");
		 user.setUserAddress("Chandrapur Maharashtra");
		 user.setMobileNumber(7378482702l);
		  Set<Role> userRoles = new HashSet<>(); userRoles.add(userRole);
		  user.setRole(userRoles);
		  userDao.save(user);
		 
    }
    public String getEncodedPassword(String password) {
    	return passwordEncoder.encode(password);
    }
    
    public User registerNewUser(User user) {
        Role role=	roleDao.findById("User").get();
    	Set<Role>roleSet=new HashSet<>();
    	roleSet.add(role);
    	user.setRole(roleSet);
    	String password= getEncodedPassword(user.getUserPassword());
    	user.setUserPassword(password);
    	
    	
        return	userDao.save(user);
    }
    

	/*
	 * public User registerNewUser(User user) { Role role =
	 * roleDao.findById("User").get(); Set<Role> userRoles = new HashSet<>();
	 * userRoles.add(role); user.setRole(userRoles);
	 * user.setUserPassword(getEncodedPassword(user.getUserPassword()));
	 * 
	 * return userDao.save(user); }
	 *

    public String getEncodedPassword(String password) {
        return passwordEncoder.encode(password);
    }*/
}
