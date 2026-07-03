package com.aritan.ebook_reader.features.tag;

import com.aritan.ebook_reader.common.constants.messages.book.TagMessage;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.models.book.Tag;
import com.aritan.ebook_reader.features.tag.dtos.TagCreateRequest;
import com.aritan.ebook_reader.features.tag.dtos.TagResponse;
import com.aritan.ebook_reader.features.tag.dtos.TagUpdatedRequest;
import com.aritan.ebook_reader.features.tag.utilities.TagMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TagService implements ITagService{
    private final ITagRepository tagRepository;
    private final TagMapper tagMapper;
    @Override
    public Page<TagResponse> getAllTagsByAdmin(Pageable page) {
        Page<Tag> tags = tagRepository.findAll(page);
        return tags.map(tagMapper::toTagResponse);
    }

    @Override
    public TagResponse getTagById(UUID tagId) {
        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new ResourceNotFoundException(TagMessage.TAG_NOT_FOUND));
        return tagMapper.toTagResponse(tag);
    }

    @Override
    public List<TagResponse> createTag(List<TagCreateRequest> requests) {
        List<Tag> tags = requests.stream()
                .map(tagMapper::toEntity)
                .toList();

        tagRepository.saveAll(tags);
        return tags.stream().map(tagMapper::toTagResponse).toList();
    }

    @Override
    public TagResponse updateTag(TagUpdatedRequest updateRequest, UUID tagId) {
        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new ResourceNotFoundException(TagMessage.TAG_NOT_FOUND));
        tagMapper.toEntity(updateRequest, tag);
        tagRepository.save(tag);
        return tagMapper.toTagResponse(tag);
    }

    @Override
    public void deleteTag(UUID tagId) {
        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new ResourceNotFoundException(TagMessage.TAG_NOT_FOUND));

        tagRepository.delete(tag);
    }

    @Override
    public List<TagResponse> getAllTags() {
        List<Tag> tags = tagRepository.findAll();
        return tags.stream().map(tagMapper::toTagResponse).toList();
    }
}
