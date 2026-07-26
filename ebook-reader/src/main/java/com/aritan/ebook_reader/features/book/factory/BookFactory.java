package com.aritan.ebook_reader.features.book.factory;

import com.aritan.ebook_reader.common.constants.messages.book.AuthorMessage;
import com.aritan.ebook_reader.common.constants.messages.book.CategoryMessage;
import com.aritan.ebook_reader.common.constants.messages.book.PublisherMessage;
import com.aritan.ebook_reader.common.constants.messages.book.TagMessage;
import com.aritan.ebook_reader.common.enums.book.BookBadge;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.models.book.*;
import com.aritan.ebook_reader.features.book.dtos.BookCreateRequest;
import com.aritan.ebook_reader.features.book.dtos.BookReferenceContext;
import com.aritan.ebook_reader.features.book.dtos.BookUpdateRequest;
import com.aritan.ebook_reader.features.book.utilities.BookMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class BookFactory {
    private final BookMapper bookMapper;

    public Book create(BookCreateRequest createRequest, BookReferenceContext context) {
        Book book = bookMapper.toBook(createRequest);
        applyReferences(book, createRequest.getAuthorIds(), createRequest.getCategoryIds(),
                createRequest.getTagIds(), createRequest.getPublisherId(), context);
        book.setBadge(BookBadge.NONE);
        return book;
    }

    public Book update(Book existingBook, BookUpdateRequest updateRequest, BookReferenceContext context) {
        bookMapper.toBook(updateRequest, existingBook);
        applyReferences(existingBook, updateRequest.getAuthorIds(), updateRequest.getCategoryIds(),
                updateRequest.getTagIds(), updateRequest.getPublisherId(), context);
        existingBook.setStatus(updateRequest.getStatus());
        return existingBook;
    }

    private void applyReferences(
            Book book,
            List<Long> authorIds,
            List<Long> categoryIds,
            List<UUID> tagIds,
            Long publisherId,
            BookReferenceContext context
    ) {
        book.setAuthors(resolveAuthors(authorIds, context));
        book.setCategories(resolveCategories(categoryIds, context));
        book.setTags(resolveTags(tagIds, context));
        book.setPublisher(resolvePublisher(publisherId, context));
    }

    private Set<Author> resolveAuthors(List<Long> authorIds, BookReferenceContext context) {
        return authorIds.stream()
                .map(id -> {
                    Author author = context.authors().get(id);
                    if (author == null) {
                        throw new ResourceNotFoundException(
                                String.format(AuthorMessage.AUTHOR_NOT_FOUND, id));
                    }
                    return author;
                })
                .collect(Collectors.toSet());
    }

    private Set<Category> resolveCategories(List<Long> categoryIds, BookReferenceContext context) {
        return categoryIds.stream()
                .map(id -> {
                    Category category = context.categories().get(id);
                    if (category == null) {
                        throw new ResourceNotFoundException(
                                CategoryMessage.CATEGORY_NOT_FOUND + id);
                    }
                    return category;
                })
                .collect(Collectors.toSet());
    }

    private Set<Tag> resolveTags(List<UUID> tagIds, BookReferenceContext context) {
        return tagIds.stream()
                .map(id -> {
                    Tag tag = context.tags().get(id);
                    if (tag == null) {
                        throw new ResourceNotFoundException(TagMessage.TAG_NOT_FOUND);
                    }
                    return tag;
                })
                .collect(Collectors.toSet());
    }

    private Publisher resolvePublisher(Long publisherId, BookReferenceContext context) {
        Publisher publisher = context.publishers().get(publisherId);
        if (publisher == null) {
            throw new ResourceNotFoundException(
                    String.format(PublisherMessage.PUBLISHER_NOT_FOUND, publisherId));
        }
        return publisher;
    }
}