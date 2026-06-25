package com.aritan.ebook_reader.features.author;

import com.aritan.ebook_reader.features.author.dtos.AuthorCreateRequest;
import com.aritan.ebook_reader.features.author.dtos.AuthorFilterRequest;
import com.aritan.ebook_reader.features.author.dtos.AuthorResponse;
import com.aritan.ebook_reader.features.author.dtos.AuthorUpdatedRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IAuthorService {
    Page<AuthorResponse> getAllAuthors(AuthorFilterRequest request, Pageable page);

    AuthorResponse getAuthorById(Long authorId);

    List<AuthorResponse> createAuthor(List<AuthorCreateRequest> requests);

    AuthorResponse updateAuthor(AuthorUpdatedRequest updateRequest, Long authorId);

    void deleteAuthor(Long authorId);
}
