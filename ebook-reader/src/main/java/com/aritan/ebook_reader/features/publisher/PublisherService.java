package com.aritan.ebook_reader.features.publisher;

import com.aritan.ebook_reader.common.constants.messages.book.PublisherMessage;
import com.aritan.ebook_reader.common.enums.outbox.FileSourceType;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.models.book.Publisher;
import com.aritan.ebook_reader.common.models.outbox.FileDeletionOutbox;
import com.aritan.ebook_reader.config.s3.utilities.StorageUrlExtension;
import com.aritan.ebook_reader.features.file.IFileDeletionOutboxRepository;
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
    private final IFileDeletionOutboxRepository fileDeletionOutboxRepository;
    private final PublisherMapper publisherMapper;
    private final StorageUrlExtension storageUrlExtension;
    @Override
    public Page<PublisherResponse> getAllPublishersByAdmin(PublisherFilterRequest request, Pageable page) {
        Specification<Publisher> spec = Specification
                .where(PublisherSpecification.hasKeyword(request.getKeyword()));

        Page<Publisher> publishers = publisherRepository.findAll(spec, page);
        return publishers.map(publisher -> {
            PublisherResponse response = publisherMapper.toPublisherResponse(publisher);
            response.setLogoUrl(storageUrlExtension.getPublicUrl(publisher.getLogoUrl()));

            return response;
        });
    }

    @Override
    public PublisherResponse getPublisherById(Long publisherId) {
        Publisher publisher = publisherRepository.findById(publisherId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(PublisherMessage.PUBLISHER_NOT_FOUND, publisherId)));
        PublisherResponse response = publisherMapper.toPublisherResponse(publisher);
        response.setLogoUrl(storageUrlExtension.getPublicUrl(publisher.getLogoUrl()));

        return response;
    }

    @Override
    @Transactional
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

        String oldLogoUrl = publisher.getLogoUrl();

        publisherMapper.updatePublisher(updateRequest, publisher);
        Publisher updatedPublisher = publisherRepository.save(publisher);

        if(updateRequest.getLogoUrl() != null && !updateRequest.getLogoUrl().equals(oldLogoUrl)) {
            FileDeletionOutbox outbox = new FileDeletionOutbox();

            outbox.setFileUrl(oldLogoUrl);
            outbox.setSourceType(FileSourceType.PUBLISHER_LOGO);
            outbox.setSourceEntityId(publisherId);

            fileDeletionOutboxRepository.save(outbox);
        }

        return publisherMapper.toPublisherResponse(updatedPublisher);
    }

    @Override
    @Transactional
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
