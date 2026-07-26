package com.aritan.ebook_reader.features.book.resolver;

import com.aritan.ebook_reader.common.models.book.Author;
import com.aritan.ebook_reader.common.models.book.Category;
import com.aritan.ebook_reader.common.models.book.Publisher;
import com.aritan.ebook_reader.common.models.book.Tag;
import com.aritan.ebook_reader.features.author.IAuthorRepository;
import com.aritan.ebook_reader.features.book.dtos.BookCreateRequest;
import com.aritan.ebook_reader.features.book.dtos.BookReferenceContext;
import com.aritan.ebook_reader.features.book.dtos.BookUpdateRequest;
import com.aritan.ebook_reader.features.category.ICategoryRepository;
import com.aritan.ebook_reader.features.publisher.IPublisherRepository;
import com.aritan.ebook_reader.features.tag.ITagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookReferenceResolver {
    private final IAuthorRepository authorRepository;
    private final ICategoryRepository categoryRepository;
    private final ITagRepository tagRepository;
    private final IPublisherRepository publisherRepository;

    public BookReferenceContext resolve(List<BookCreateRequest> requests){
        Set<Long> authorIds = requests.stream()
                .flatMap(request -> request.getAuthorIds().stream())
                .collect(Collectors.toSet());

        Set<Long> categoryIds = requests.stream()
                .flatMap(request -> request.getCategoryIds().stream())
                .collect(Collectors.toSet());

        Set<Long> publisherIds = requests.stream()
                .map(BookCreateRequest::getPublisherId)
                .collect(Collectors.toSet());

        Set<UUID> tagIds = requests.stream()
                .map(BookCreateRequest::getTagIds)
                .flatMap(List::stream)
                .collect(Collectors.toSet());

        return buildContext(authorIds, categoryIds, tagIds, publisherIds);
    }

    public BookReferenceContext resolve(BookUpdateRequest request) {
        Set<Long> authorIds = new HashSet<>(request.getAuthorIds());
        Set<Long> categoryIds = new HashSet<>(request.getCategoryIds());
        Set<UUID> tagIds = new HashSet<>(request.getTagIds());
        Set<Long> publisherIds = Set.of(request.getPublisherId());

        return buildContext(authorIds, categoryIds, tagIds, publisherIds);
    }

    private BookReferenceContext buildContext(
            Set<Long> authorIds,
            Set<Long> categoryIds,
            Set<UUID> tagIds,
            Set<Long> publisherIds
    ) {
        Map<Long, Author> authorMap = authorRepository.findAllById(authorIds).stream()
                .collect(Collectors.toMap(Author::getAuthorId, author -> author));
        Map<Long, Category> categoryMap = categoryRepository.findAllById(categoryIds).stream()
                .collect(Collectors.toMap(Category::getCategoryId, category -> category));
        Map<Long, Publisher> publisherMap = publisherRepository.findAllById(publisherIds).stream()
                .collect(Collectors.toMap(Publisher::getPublisherId, publisher -> publisher));
        Map<UUID, Tag> tagMap = tagRepository.findAllById(tagIds).stream()
                .collect(Collectors.toMap(Tag::getTagId, tag -> tag));

        return new BookReferenceContext(authorMap, categoryMap, tagMap, publisherMap);
    }
}
