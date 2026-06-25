package com.aritan.ebook_reader.features.tag.utilities;

import com.aritan.ebook_reader.common.models.Tag;
import com.aritan.ebook_reader.features.tag.dtos.TagCreateRequest;
import com.aritan.ebook_reader.features.tag.dtos.TagResponse;
import com.aritan.ebook_reader.features.tag.dtos.TagUpdatedRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TagMapper {
    TagResponse toTagResponse(Tag tag);

    @Mapping(target = "tagId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Tag toEntity(TagCreateRequest createRequest);

    @Mapping(target = "tagId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void toEntity(TagUpdatedRequest updatedRequest, @MappingTarget Tag tag);
}
