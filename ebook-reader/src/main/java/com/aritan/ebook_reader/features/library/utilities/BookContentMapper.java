package com.aritan.ebook_reader.features.library.utilities;

import com.aritan.ebook_reader.common.models.book.BookFormat;
import com.aritan.ebook_reader.features.library.dtos.BookContentFormatResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BookContentMapper {
    @Mapping(target = "bookId", source = "book.bookId")
    @Mapping(target = "bookTitle", source = "book.title")
    @Mapping(target = "formatType", source = "formatType")
    @Mapping(target = "mimeType", source = "mimeType")
    BookContentFormatResponse toBookReaderResponse(BookFormat format);
}
