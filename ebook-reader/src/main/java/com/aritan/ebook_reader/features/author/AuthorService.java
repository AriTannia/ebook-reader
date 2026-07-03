package com.aritan.ebook_reader.features.author;

import com.aritan.ebook_reader.common.constants.messages.book.AuthorMessage;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.models.book.Author;
import com.aritan.ebook_reader.features.author.dtos.AuthorCreateRequest;
import com.aritan.ebook_reader.features.author.dtos.AuthorFilterRequest;
import com.aritan.ebook_reader.features.author.dtos.AuthorResponse;
import com.aritan.ebook_reader.features.author.dtos.AuthorUpdatedRequest;
import com.aritan.ebook_reader.features.author.utilities.AuthorMapper;
import com.aritan.ebook_reader.features.author.utilities.AuthorSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthorService implements IAuthorService{
    private final IAuthorRepository authorRepository;
    private final AuthorMapper authorMapper;
    @Override
    public Page<AuthorResponse> getAllAuthorsByAdmin(AuthorFilterRequest request, Pageable page) {
        Specification<Author> spec = Specification
                .where(AuthorSpecification.hasKeyword(request.getKeyword()));

        Page<Author> authors = authorRepository.findAll(spec, page);
        return authors.map(authorMapper::toAuthorResponse);
    }

    @Override
    public AuthorResponse getAuthorById(Long authorId) {
        Author author = authorRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(AuthorMessage.AUTHOR_NOT_FOUND, authorId)));

        return authorMapper.toAuthorResponse(author);
    }

    @Override
    public List<AuthorResponse> createAuthor(List<AuthorCreateRequest> requests) {
        List<Author> authors = requests.stream()
                .map(authorMapper::toAuthor)
                .toList();

        List<Author> savedAuthors = authorRepository.saveAll(authors);

        return savedAuthors.stream().map(authorMapper::toAuthorResponse).toList();
    }

    @Override
    @Transactional
    public AuthorResponse updateAuthor(AuthorUpdatedRequest updateRequest, Long authorId) {
        Author existedAuthor = authorRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(AuthorMessage.AUTHOR_NOT_FOUND, authorId)));

        authorMapper.updateAuthor(updateRequest, existedAuthor);
        Author updatedAuthor = authorRepository.save(existedAuthor);

        return authorMapper.toAuthorResponse(updatedAuthor);
    }

    @Override
    public void deleteAuthor(Long authorId) {
        Author author = authorRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(AuthorMessage.AUTHOR_NOT_FOUND, authorId)));

        authorRepository.delete(author);
    }

    @Override
    public List<AuthorResponse> getAllAuthors() {
        List<Author> authors = authorRepository.findAll();
        return authors.stream().map(authorMapper::toAuthorResponse).toList();
    }
}
