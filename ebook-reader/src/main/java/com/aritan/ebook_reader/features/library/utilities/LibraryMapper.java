package com.aritan.ebook_reader.features.library.utilities;

import com.aritan.ebook_reader.common.models.book.Book;
import com.aritan.ebook_reader.common.models.book.ReadingProgress;
import com.aritan.ebook_reader.common.models.book.UserLibrary;
import com.aritan.ebook_reader.common.models.order.OrderItem;
import com.aritan.ebook_reader.common.models.user.User;
import com.aritan.ebook_reader.features.library.dtos.UserLibraryBookResponse;
import com.aritan.ebook_reader.features.library.dtos.UserLibraryReadingProgressResponse;
import com.aritan.ebook_reader.features.library.dtos.UserLibraryResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.math.BigDecimal;

@Mapper(componentModel = "spring")
public interface LibraryMapper {
    @Mapping(target = "book", source = "userLibrary.book")
    @Mapping(target = "readingProgress", expression = "java(toProgressResponse(progress))")
    UserLibraryResponse toResponse(UserLibrary userLibrary, ReadingProgress progress);
    UserLibraryBookResponse ToBookResponse(Book book);

    @Mapping(target = "userLibraryId", ignore = true)
    @Mapping(target = "user", source = "user")
    @Mapping(target = "book", source = "item.book")
    @Mapping(target = "sourceOrderItem", source = "item")
    @Mapping(target = "accessStatus", ignore = true)
    @Mapping(target = "isFavorite", ignore = true)
    @Mapping(target = "acquiredAt", ignore = true)
    void toEntity(OrderItem item, User user, @MappingTarget UserLibrary userLibrary);
    default UserLibraryReadingProgressResponse toProgressResponse(ReadingProgress progress){
        UserLibraryReadingProgressResponse response = new UserLibraryReadingProgressResponse();
        response.setProgressPercent(progress != null ? progress.getProgressPercent() : BigDecimal.ZERO);
        response.setStatus(progress != null ? progress.getStatus() : null);

        return response;
    }
}
