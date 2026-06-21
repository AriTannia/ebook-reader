package com.aritan.ebook_reader.features.user;

import com.aritan.ebook_reader.common.constants.UserMessages;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.models.User;
import com.aritan.ebook_reader.features.user.dtos.UserRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService{
    private final IUserRepository userRepository;


    @Override
    public List<User> getAllUsers() {
        List<User> users = userRepository.findAll();
        if(users.isEmpty()){
            throw new ResourceNotFoundException(UserMessages.NO_DATA_FOUND);
        }

        return users;
    }

    @Override
    public User createUser(UserRequest user) {
        User newUser = new User();
        newUser.setEmail(user.getEmail());
        newUser.setPasswordHash(user.getPassword());
        newUser.setFullName(user.getFullName());

        userRepository.save(newUser);
        return newUser;
    }

    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(UserMessages.NO_DATA_FOUND));
    }
}
