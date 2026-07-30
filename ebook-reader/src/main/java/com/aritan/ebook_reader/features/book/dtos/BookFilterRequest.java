package com.aritan.ebook_reader.features.book.dtos;

import com.aritan.ebook_reader.common.enums.book.BookStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookFilterRequest {
    private Set<Long> authorIds;
    private Set<Long> categoryIds;
    private Long publisherId;
    private Set<UUID> tagIds;
    private Set<BookStatus> statuses;
    private String keyword;
}
