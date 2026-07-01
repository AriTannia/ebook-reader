package com.aritan.ebook_reader.features.author;

import com.aritan.ebook_reader.common.constants.messages.AuthorMessage;
import com.aritan.ebook_reader.common.models.EBResponse;
import com.aritan.ebook_reader.features.author.dtos.AuthorCreateRequest;
import com.aritan.ebook_reader.features.author.dtos.AuthorFilterRequest;
import com.aritan.ebook_reader.features.author.dtos.AuthorResponse;
import com.aritan.ebook_reader.features.author.dtos.AuthorUpdatedRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/authors")
public class AuthorController {
    private final IAuthorService authorService;
    // Public
    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<List<AuthorResponse>>> getAllAuthors(){
        var result = authorService.getAllAuthors();

        return ResponseEntity.ok(EBResponse.Success(result, AuthorMessage.AUTHORS_RETRIEVED_SUCCESSFULLY));
    }

    @GetMapping("{authorId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<AuthorResponse>> getAuthorById(@PathVariable Long authorId){
        var result = authorService.getAuthorById(authorId);
        return ResponseEntity.ok(
                EBResponse.Success(result, String.format(AuthorMessage.AUTHOR_RETRIEVED_SUCCESSFULLY, authorId)));
    }

    // Admin
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<Page<AuthorResponse>>> getAllAuthorsByAdmin(AuthorFilterRequest request, Pageable page){
        var result = authorService.getAllAuthorsByAdmin(request, page);

        return ResponseEntity.ok(EBResponse.Success(result, AuthorMessage.AUTHORS_RETRIEVED_SUCCESSFULLY));
    }

    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<List<AuthorResponse>>> createAuthor(
            @RequestBody List<AuthorCreateRequest> requests){
        var result = authorService.createAuthor(requests);
        return ResponseEntity.ok(EBResponse.Created(result, AuthorMessage.AUTHOR_CREATED_SUCCESSFULLY));
    }

    @PutMapping("/{authorId}/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<AuthorResponse>> updateAuthor(
            @RequestBody AuthorUpdatedRequest updateRequest,
            @PathVariable Long authorId){
        var result = authorService.updateAuthor(updateRequest, authorId);
        return ResponseEntity.ok(
                EBResponse.Success(result, String.format(AuthorMessage.AUTHOR_UPDATED_SUCCESSFULLY, authorId)));
    }

    @DeleteMapping("/{authorId}/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<?>> deleteAuthor(@PathVariable Long authorId){
        authorService.deleteAuthor(authorId);
        return ResponseEntity.ok(
                EBResponse.Success(null, String.format(AuthorMessage.AUTHOR_DELETED_SUCCESSFULLY, authorId)));
    }
}
