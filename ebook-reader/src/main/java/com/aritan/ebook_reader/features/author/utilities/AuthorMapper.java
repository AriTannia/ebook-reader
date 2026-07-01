package com.aritan.ebook_reader.features.author.utilities;

import com.aritan.ebook_reader.common.models.book.Author;
import com.aritan.ebook_reader.features.author.dtos.AuthorCreateRequest;
import com.aritan.ebook_reader.features.author.dtos.AuthorResponse;
import com.aritan.ebook_reader.features.author.dtos.AuthorUpdatedRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface AuthorMapper {
    AuthorResponse toAuthorResponse(Author author);
    @Mapping(target = "authorId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Author toAuthor(AuthorCreateRequest createRequest);

    @Mapping(target = "authorId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateAuthor(
            AuthorUpdatedRequest updatedRequest,
            @MappingTarget Author author);
}
