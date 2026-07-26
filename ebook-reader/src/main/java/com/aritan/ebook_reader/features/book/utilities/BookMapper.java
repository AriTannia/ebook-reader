package com.aritan.ebook_reader.features.book.utilities;

import com.aritan.ebook_reader.common.enums.book.BookStatus;
import com.aritan.ebook_reader.common.models.book.Book;
import com.aritan.ebook_reader.common.models.book.BookFormat;
import com.aritan.ebook_reader.common.models.book.Author;
import com.aritan.ebook_reader.common.models.book.Category;
import com.aritan.ebook_reader.common.models.book.Publisher;
import com.aritan.ebook_reader.features.author.utilities.AuthorMapper;
import com.aritan.ebook_reader.features.book.dtos.*;
import com.aritan.ebook_reader.features.category.utilities.CategoryMapper;
import com.aritan.ebook_reader.features.publisher.utilities.PublisherMapper;
import com.aritan.ebook_reader.features.tag.utilities.TagMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(
    componentModel = "spring",
    uses = {
            AuthorMapper.class,
            CategoryMapper.class,
            PublisherMapper.class,
            TagMapper.class
    }
)
public interface BookMapper {
    BookResponse toBookResponse(Book book);
    BookDetailsResponse toDetailsResponse(Book book);

    @Mapping(target = "bookId", ignore = true)
    @Mapping(target = "status", constant = BookStatus.ACTIVE_VALUE)
    @Mapping(target = "authors", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "publisher", ignore = true)
    @Mapping(target = "tags", ignore = true)
    @Mapping(target = "badge", ignore = true)
    @Mapping(target = "averageRating", ignore = true)
    @Mapping(target = "reviewCount", ignore = true)
    @Mapping(target = "soldCopies", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Book toBook(BookCreateRequest createRequest);

    @Mapping(target = "bookId", ignore = true)
    @Mapping(target = "authors", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "tags", ignore = true)
    @Mapping(target = "publisher", ignore = true)
    @Mapping(target = "badge", ignore = true)
    @Mapping(target = "averageRating", ignore = true)
    @Mapping(target = "reviewCount", ignore = true)
    @Mapping(target = "soldCopies", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void toBook(
            BookUpdateRequest request,
            @MappingTarget Book book
    );

    BookFormatResponse toFormatResponse(BookFormat bookFormat);

    @Mapping(target = "bookFormatId", ignore = true)
    @Mapping(target = "book", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    BookFormat toBookFormat(BookFormatCreateRequest createRequest);

    @Mapping(target = "bookFormatId", ignore = true)
    @Mapping(target = "book", ignore = true)
    @Mapping(target = "storageUrl", ignore = true)
    @Mapping(target = "formatType", ignore = true)
    @Mapping(target = "mimeType", ignore = true)
    @Mapping(target = "fileSize", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void toBookFormat(
            BookFormatUpdateRequest request,
            @MappingTarget BookFormat bookFormat
    );

    @Mapping(target = "authorNames", source = "authors")
    BookSummaryResponse toSummaryResponse(Book book);

    @Mapping(target = "authorNames", source = "authors")
    BookAdminResponse toAdminResponse(Book book);

    default String toAuthorNames(Set<Author> authors){
        if(authors == null) return null;

        return authors.stream()
                .map(Author::getAuthorName)
                .collect(Collectors.joining(", "));
    }

    default Set<Long> mapAuthorsToIds(Set<Author> authors) {
        if (authors == null) return null;
        return authors.stream()
                .map(Author::getAuthorId)
                .collect(Collectors.toSet());
    }

    default Set<Long> mapCategoriesToIds(Set<Category> categories) {
        if (categories == null) return null;
        return categories.stream()
                .map(Category::getCategoryId)
                .collect(Collectors.toSet());
    }

    default Long mapPublisherToId(Publisher publisher) {
        if (publisher == null) return null;
        return publisher.getPublisherId();
    }
}
