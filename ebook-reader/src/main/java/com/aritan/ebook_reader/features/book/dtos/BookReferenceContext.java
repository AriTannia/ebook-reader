package com.aritan.ebook_reader.features.book.dtos;

import com.aritan.ebook_reader.common.models.Author;
import com.aritan.ebook_reader.common.models.Category;
import com.aritan.ebook_reader.common.models.Publisher;

import java.util.Map;

public record BookReferenceContext(
        Map<Long, Author> authors,
        Map<Long, Category> categories,
        Map<Long, Publisher> publishers
) {
}
