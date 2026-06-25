package com.aritan.ebook_reader.features.publisher;

import com.aritan.ebook_reader.features.publisher.dtos.PublisherCreateRequest;
import com.aritan.ebook_reader.features.publisher.dtos.PublisherFilterRequest;
import com.aritan.ebook_reader.features.publisher.dtos.PublisherResponse;
import com.aritan.ebook_reader.features.publisher.dtos.PublisherUpdatedRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IPublisherService {
    Page<PublisherResponse> getAllPublishers(PublisherFilterRequest request, Pageable page);

    PublisherResponse getPublisherById(Long publisherId);

    List<PublisherResponse> createPublisher(List<PublisherCreateRequest> requests);

    PublisherResponse updatePublisher(PublisherUpdatedRequest updateRequest, Long publisherId);

    void deletePublisher(Long publisherId);
}
