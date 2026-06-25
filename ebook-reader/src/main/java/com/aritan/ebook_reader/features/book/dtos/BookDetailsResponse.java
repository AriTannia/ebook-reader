package com.aritan.ebook_reader.features.book.dtos;

import com.aritan.ebook_reader.common.enums.BookStatus;
import com.aritan.ebook_reader.features.author.dtos.AuthorBookResponse;
import com.aritan.ebook_reader.features.author.dtos.AuthorResponse;
import com.aritan.ebook_reader.features.category.dtos.CategoryBookResponse;
import com.aritan.ebook_reader.features.category.dtos.CategoryResponse;
import com.aritan.ebook_reader.features.publisher.dtos.PublisherResponse;
import com.aritan.ebook_reader.features.publisher.utilities.PublisherMapper;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
public class BookDetailsResponse {
    private Long bookId;
    private String title;
    private String description;
    private BigDecimal price;
    private String coverImageUrl;
    private String language;
    private LocalDate publishedDate;
    private BookStatus status;
    private Set<AuthorBookResponse> authors;
    private Set<CategoryBookResponse> categories;
    private PublisherResponse publisher;

}
