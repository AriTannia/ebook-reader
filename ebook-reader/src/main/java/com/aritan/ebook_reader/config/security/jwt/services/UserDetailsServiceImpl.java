package com.aritan.ebook_reader.config.security.jwt.services;

import com.aritan.ebook_reader.common.constants.messages.UserMessage;
import com.aritan.ebook_reader.common.models.User;
import com.aritan.ebook_reader.features.user.IUserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final IUserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(UserDetailsServiceImpl.class);

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        long start = System.currentTimeMillis();
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        String.format(UserMessage.USER_NOT_FOUND_WITH_EMAIL, username)
                ));

        logger.info("Find user: {} ms", System.currentTimeMillis() - start);

        return UserDetailsImpl.build(user);
    }
}
