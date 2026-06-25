package com.aritan.ebook_reader.features.book.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookTagResponse {
    private UUID tagId;
    private String tagName;
}
