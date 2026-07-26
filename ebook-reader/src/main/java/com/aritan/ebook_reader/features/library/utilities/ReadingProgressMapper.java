package com.aritan.ebook_reader.features.library.utilities;

import com.aritan.ebook_reader.common.models.book.Book;
import com.aritan.ebook_reader.common.models.book.BookFormat;
import com.aritan.ebook_reader.common.models.book.ReadingProgress;
import com.aritan.ebook_reader.common.models.order.OrderItem;
import com.aritan.ebook_reader.common.models.user.User;
import com.aritan.ebook_reader.features.library.dtos.BookContentFormatResponse;
import com.aritan.ebook_reader.features.library.dtos.ReadingProgressBookResponse;
import com.aritan.ebook_reader.features.library.dtos.ReadingProgressResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReadingProgressMapper {
    @Mapping(target = "book", source = "book")
    ReadingProgressResponse toResponse(ReadingProgress progress);

    ReadingProgressBookResponse toBookResponse(Book book);

    @Mapping(target = "readingProgressId", ignore = true)
    @Mapping(target = "book", source = "item.book")
    @Mapping(target = "user", source = "user")
    @Mapping(target = "locator", ignore = true)
    @Mapping(target = "progressPercent", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "lastReadAt", ignore = true)
    @Mapping(target = "finishedAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    ReadingProgress toEntity(OrderItem item, User user);
}
