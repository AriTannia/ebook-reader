package com.aritan.ebook_reader.features.tag;

import com.aritan.ebook_reader.common.constants.messages.TagMessage;
import com.aritan.ebook_reader.common.models.EBResponse;
import com.aritan.ebook_reader.features.tag.dtos.TagCreateRequest;
import com.aritan.ebook_reader.features.tag.dtos.TagResponse;
import com.aritan.ebook_reader.features.tag.dtos.TagUpdatedRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/tags")
public class TagController {
    private final ITagService tagService;

    // Public
    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<List<TagResponse>>> getAllTags(){
        var result = tagService.getAllTags();

        return ResponseEntity.ok(EBResponse.Success(result, TagMessage.TAG_RETRIEVED_SUCCESSFULLY));
    }

    @GetMapping("{tagId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<TagResponse>> getTagById(
            @PathVariable UUID tagId){
        var result = tagService.getTagById(tagId);
        return ResponseEntity.ok(
                EBResponse.Success(result, TagMessage.TAG_RETRIEVED_SUCCESSFULLY));
    }

    // Admin
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<Page<TagResponse>>> getAllTagsByAdmin(Pageable page){
        var result = tagService.getAllTagsByAdmin(page);

        return ResponseEntity.ok(EBResponse.Success(result, TagMessage.TAG_RETRIEVED_SUCCESSFULLY));
    }

    @PostMapping("/admin")
    @PreAuthorize("/admin/hasRole('ADMIN')")
    public ResponseEntity<EBResponse<List<TagResponse>>> createTag(
            @RequestBody List<TagCreateRequest> requests){
        var result = tagService.createTag(requests);
        return ResponseEntity.ok(EBResponse.Created(result, TagMessage.TAG_CREATED_SUCCESSFULLY));
    }

    @PutMapping("/{tagId}/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<TagResponse>> updateTag(
            @RequestBody TagUpdatedRequest updateRequest,
            @PathVariable UUID tagId){
        var result = tagService.updateTag(updateRequest, tagId);
        return ResponseEntity.ok(
                EBResponse.Success(result, TagMessage.TAG_UPDATED_SUCCESSFULLY));
    }

    @DeleteMapping("/{tagId}/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<?>> deleteTag(@PathVariable UUID tagId){
        tagService.deleteTag(tagId);
        return ResponseEntity.ok(
                EBResponse.Success(null, TagMessage.TAG_DELETED_SUCCESSFULLY));
    }
}
