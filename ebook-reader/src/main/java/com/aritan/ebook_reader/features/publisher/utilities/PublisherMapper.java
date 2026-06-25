package com.aritan.ebook_reader.features.publisher.utilities;

import com.aritan.ebook_reader.common.models.Publisher;
import com.aritan.ebook_reader.features.publisher.dtos.PublisherCreateRequest;
import com.aritan.ebook_reader.features.publisher.dtos.PublisherResponse;
import com.aritan.ebook_reader.features.publisher.dtos.PublisherUpdatedRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PublisherMapper {
    PublisherResponse toPublisherResponse(Publisher publisher);

    @Mapping(target = "publisherId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Publisher toPublisher(PublisherCreateRequest createRequest);

    @Mapping(target = "publisherId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updatePublisher(
            PublisherUpdatedRequest updatedRequest,
            @MappingTarget Publisher publisher
    );

}
