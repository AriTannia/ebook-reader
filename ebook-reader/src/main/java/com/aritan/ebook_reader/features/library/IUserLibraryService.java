package com.aritan.ebook_reader.features.library;

import com.aritan.ebook_reader.common.models.order.Order;
import com.aritan.ebook_reader.common.models.order.OrderItem;
import com.aritan.ebook_reader.common.models.user.User;
import com.aritan.ebook_reader.features.library.dtos.LibraryFilterRequest;
import com.aritan.ebook_reader.features.library.dtos.UserLibraryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IUserLibraryService {
    void grantAcess(Order order);
    void revokeAccess(Long userId, Long bookId, String reason);
    Page<UserLibraryResponse> getMyLibrary(Long userId, LibraryFilterRequest filterRequest, Pageable pageable);
    boolean hasAccess(Long userId, Long bookId);
    void toggleFavorite(Long userId, Long bookId, boolean isFavorite);
    void addBookToUserLibrary(User user, OrderItem orderItem);
}
