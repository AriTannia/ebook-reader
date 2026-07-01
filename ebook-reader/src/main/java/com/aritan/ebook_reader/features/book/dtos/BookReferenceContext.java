package com.aritan.ebook_reader.features.book.dtos;

import com.aritan.ebook_reader.common.models.book.Author;
import com.aritan.ebook_reader.common.models.book.Category;
import com.aritan.ebook_reader.common.models.book.Publisher;
import com.aritan.ebook_reader.common.models.book.Tag;

import java.util.Map;
import java.util.UUID;

public record BookReferenceContext(
        Map<Long, Author> authors,
        Map<Long, Category> categories,
        Map<UUID, Tag> tags,
        Map<Long, Publisher> publishers
) {
}
