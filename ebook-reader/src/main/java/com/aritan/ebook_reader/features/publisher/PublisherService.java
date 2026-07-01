package com.aritan.ebook_reader.features.publisher;

import com.aritan.ebook_reader.common.constants.messages.PublisherMessage;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.models.book.Publisher;
import com.aritan.ebook_reader.features.publisher.dtos.PublisherCreateRequest;
import com.aritan.ebook_reader.features.publisher.dtos.PublisherFilterRequest;
import com.aritan.ebook_reader.features.publisher.dtos.PublisherResponse;
import com.aritan.ebook_reader.features.publisher.dtos.PublisherUpdatedRequest;
import com.aritan.ebook_reader.features.publisher.utilities.PublisherMapper;
import com.aritan.ebook_reader.features.publisher.utilities.PublisherSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PublisherService implements IPublisherService{
    private final IPublisherRepository publisherRepository;
    private final PublisherMapper publisherMapper;
    @Override
    public Page<PublisherResponse> getAllPublishersByAdmin(PublisherFilterRequest request, Pageable page) {
        Specification<Publisher> spec = Specification
                .where(PublisherSpecification.hasKeyword(request.getKeyword()));

        Page<Publisher> publishers = publisherRepository.findAll(spec, page);
        return publishers.map(publisherMapper::toPublisherResponse);
    }

    @Override
    public PublisherResponse getPublisherById(Long publisherId) {
        Publisher publisher = publisherRepository.findById(publisherId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(PublisherMessage.PUBLISHER_NOT_FOUND, publisherId)));
        return publisherMapper.toPublisherResponse(publisher);
    }

    @Override
    public List<PublisherResponse> createPublisher(List<PublisherCreateRequest> requests) {
        List<Publisher> publishers = requests.stream()
                .map(publisherMapper::toPublisher)
                .toList();

        List<Publisher> savedPublishers = publisherRepository.saveAll(publishers);

        return savedPublishers.stream().map(publisherMapper::toPublisherResponse).toList();
    }

    @Override
    @Transactional
    public PublisherResponse updatePublisher(PublisherUpdatedRequest updateRequest, Long publisherId) {
        Publisher publisher = publisherRepository.findById(publisherId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(PublisherMessage.PUBLISHER_NOT_FOUND, publisherId)));

        publisherMapper.updatePublisher(updateRequest, publisher);
        Publisher updatedPublisher = publisherRepository.save(publisher);

        return publisherMapper.toPublisherResponse(updatedPublisher);
    }

    @Override
    public void deletePublisher(Long publisherId) {
        Publisher publisher = publisherRepository.findById(publisherId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(PublisherMessage.PUBLISHER_NOT_FOUND, publisherId)));
        publisherRepository.delete(publisher);
    }

    @Override
    public List<PublisherResponse> getAllPublishers() {
        List<Publisher> publishers = publisherRepository.findAll();
        return publishers.stream().map(publisherMapper::toPublisherResponse).toList();
    }
}
