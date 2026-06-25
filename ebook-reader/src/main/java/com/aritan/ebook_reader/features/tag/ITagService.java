package com.aritan.ebook_reader.features.tag;

import com.aritan.ebook_reader.features.tag.dtos.TagCreateRequest;
import com.aritan.ebook_reader.features.tag.dtos.TagResponse;
import com.aritan.ebook_reader.features.tag.dtos.TagUpdatedRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ITagService {
    Page<TagResponse> getAllTags(Pageable page);

    TagResponse getTagById(UUID tagId);

    List<TagResponse> createTag(List<TagCreateRequest> requests);

    TagResponse updateTag(TagUpdatedRequest updateRequest, UUID tagId);

    void deleteTag(UUID tagId);
}
