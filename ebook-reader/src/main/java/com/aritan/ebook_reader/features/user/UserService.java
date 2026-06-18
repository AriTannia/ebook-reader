package com.aritan.ebook_reader.features.user;

import com.aritan.ebook_reader.common.constants.UserMessages;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.features.user.dtos.UserRequest;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class UserService implements IUserService{
    private IUserRepository userRepository;


    @Override
    public List<User> getAllUsers() {
        List<User> users = userRepository.findAll();
        if(users.isEmpty()){
            throw new ResourceNotFoundException(UserMessages.NOT_FOUND);
        }

        return users;
    }

    @Override
    public User createUser(UserRequest user) {
        User newUser = new User();
        newUser.setEmail(user.getEmail());
        newUser.setPasswordHash(user.getPassword());
        newUser.setFullName(user.getFullName());
        newUser.setRole(0);

        userRepository.save(newUser);
        return newUser;
    }

    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(UserMessages.NOT_FOUND));
    }
}
