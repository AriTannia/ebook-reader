package com.aritan.ebook_reader.features.library.utilities;

import com.aritan.ebook_reader.common.models.book.Book;
import com.aritan.ebook_reader.common.models.book.BookFormat;
import com.aritan.ebook_reader.common.models.book.ReadingProgress;
import com.aritan.ebook_reader.features.library.dtos.BookReaderResponse;
import com.aritan.ebook_reader.features.library.dtos.ReadingProgressBookResponse;
import com.aritan.ebook_reader.features.library.dtos.ReadingProgressResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReadingProgressMapper {
    @Mapping(target = "book", source = "book")
    ReadingProgressResponse toResponse(ReadingProgress progress);

    ReadingProgressBookResponse toBookResponse(Book book);

    @Mapping(target = "bookId", source = "book.bookId")
    @Mapping(target = "bookTitle", source = "book.title")
    @Mapping(target = "formatType", source = "book.formatType")
    @Mapping(target = "storageUrl", source = "presignedUrl")
    @Mapping(target = "mimeType", source = "book.mimeType")
    @Mapping(target = "locator", ignore = true)
    @Mapping(target = "progressPercent", ignore = true)
    BookReaderResponse toBookReaderResponse(BookFormat format, String presignedUrl);
}
