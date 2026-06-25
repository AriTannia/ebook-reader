package com.aritan.ebook_reader.features.book.resolver;

import com.aritan.ebook_reader.common.models.Author;
import com.aritan.ebook_reader.common.models.Category;
import com.aritan.ebook_reader.common.models.Publisher;
import com.aritan.ebook_reader.common.models.Tag;
import com.aritan.ebook_reader.features.author.IAuthorRepository;
import com.aritan.ebook_reader.features.book.dtos.BookCreateRequest;
import com.aritan.ebook_reader.features.book.dtos.BookReferenceContext;
import com.aritan.ebook_reader.features.category.ICategoryRepository;
import com.aritan.ebook_reader.features.publisher.IPublisherRepository;
import com.aritan.ebook_reader.features.tag.ITagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
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

        Map<Long, Author> authorMap = authorRepository.findAllById(authorIds).stream()
                .collect(Collectors.toMap(Author::getAuthorId, author -> author));

        Map<Long, Category> categoryMap = categoryRepository.findAllById(categoryIds).stream()
                .collect(Collectors.toMap(Category::getCategoryId, category -> category));

        Map<Long, Publisher> publisherMap = publisherRepository.findAllById(publisherIds).stream()
                .collect(Collectors.toMap(Publisher::getPublisherId, publisher -> publisher));

        Map<UUID, Tag> tagMap = tagRepository.findAllById(tagIds).stream()
                .collect(Collectors.toMap(Tag::getTagId, tag -> tag));

        return new BookReferenceContext(
                authorMap,
                categoryMap,
                tagMap,
                publisherMap
        );
    }
}
