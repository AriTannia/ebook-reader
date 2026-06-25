package com.aritan.ebook_reader.features.book.factory;

import com.aritan.ebook_reader.common.constants.messages.AuthorMessage;
import com.aritan.ebook_reader.common.constants.messages.CategoryMessage;
import com.aritan.ebook_reader.common.constants.messages.PublisherMessage;
import com.aritan.ebook_reader.common.constants.messages.TagMessage;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.models.*;
import com.aritan.ebook_reader.features.book.dtos.BookCreateRequest;
import com.aritan.ebook_reader.features.book.dtos.BookReferenceContext;
import com.aritan.ebook_reader.features.book.utilities.BookMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class BookFactory {
    private final BookMapper bookMapper;

    public Book create(
            BookCreateRequest createRequest,
            BookReferenceContext context){
        Book book = bookMapper.toBook(createRequest);

        Set<Author> authors = resolveAuthors(createRequest, context);
        Set<Category> categories = resolveCategories(createRequest, context);
        Set<Tag> tags = resolverTags(createRequest, context);
        Publisher publisher = resolvePublisher(createRequest, context);

        book.setAuthors(authors);
        book.setCategories(categories);
        book.setTags(tags);
        book.setPublisher(publisher);

        return book;
    }

    private Set<Author> resolveAuthors(
            BookCreateRequest createRequest,
            BookReferenceContext context
    ) {
        return createRequest.getAuthorIds()
                .stream().map(id -> {
                    Author author = context.authors().get(id);
                    if (author == null) {
                        throw new ResourceNotFoundException(
                                String.format(AuthorMessage.AUTHOR_NOT_FOUND, id));
                    }

                    return author;
                })
                .collect(Collectors.toSet());
    }

    private Set<Category> resolveCategories(
            BookCreateRequest request,
            BookReferenceContext context
    ) {

        return request.getCategoryIds()
                .stream()
                .map(id -> {

                    Category category =
                            context.categories().get(id);

                    if (category == null) {
                        throw new ResourceNotFoundException(
                                CategoryMessage.CATEGORY_NOT_FOUND + id
                        );
                    }

                    return category;
                })
                .collect(Collectors.toSet());
    }

    private Set<Tag> resolverTags(
            BookCreateRequest request,
            BookReferenceContext context
    ){
        return request.getTagIds()
                .stream()
                .map(id -> {
                    Tag tag = context.tags().get(id);
                    if (tag == null) {
                        throw new ResourceNotFoundException(
                                TagMessage.TAG_NOT_FOUND
                        );
                    }
                    return tag;
                })
                .collect(Collectors.toSet());
    }

    private Publisher resolvePublisher(
            BookCreateRequest request,
            BookReferenceContext context
    ) {

        Publisher publisher =
                context.publishers()
                        .get(request.getPublisherId());

        if (publisher == null) {
            throw new ResourceNotFoundException(
                    String.format(
                            PublisherMessage.PUBLISHER_NOT_FOUND,
                            request.getPublisherId())
            );
        }

        return publisher;
    }
}