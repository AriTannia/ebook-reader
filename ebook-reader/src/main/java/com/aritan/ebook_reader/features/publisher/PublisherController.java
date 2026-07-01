package com.aritan.ebook_reader.features.publisher;

import com.aritan.ebook_reader.common.constants.messages.PublisherMessage;
import com.aritan.ebook_reader.common.models.EBResponse;
import com.aritan.ebook_reader.features.publisher.dtos.PublisherFilterRequest;
import com.aritan.ebook_reader.features.publisher.dtos.PublisherResponse;
import com.aritan.ebook_reader.features.publisher.dtos.PublisherCreateRequest;
import com.aritan.ebook_reader.features.publisher.dtos.PublisherUpdatedRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/publishers")
public class PublisherController {
    private final IPublisherService publisherService;

    // Public
    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<List<PublisherResponse>>> getAllPublishers(){
        var result = publisherService.getAllPublishers();

        return ResponseEntity.ok(EBResponse.Success(result, PublisherMessage.PUBLISHERS_RETRIEVED_SUCCESSFULLY));
    }

    @GetMapping("{publisherId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<PublisherResponse>> getPublisherById(@PathVariable Long publisherId){
        var result = publisherService.getPublisherById(publisherId);
        return ResponseEntity.ok(
                EBResponse.Success(result,
                        String.format(PublisherMessage.PUBLISHER_RETRIEVED_SUCCESSFULLY, publisherId)));
    }

    // Admin
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<Page<PublisherResponse>>> getAllPublishersByAdmin(
            PublisherFilterRequest request, Pageable page){
        var result = publisherService.getAllPublishersByAdmin(request, page);

        return ResponseEntity.ok(EBResponse.Success(result, PublisherMessage.PUBLISHERS_RETRIEVED_SUCCESSFULLY));
    }
    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<List<PublisherResponse>>> createPublisher(
            @RequestBody List<PublisherCreateRequest> requests){
        var result = publisherService.createPublisher(requests);
        return ResponseEntity.ok(EBResponse.Created(result, PublisherMessage.PUBLISHER_CREATED_SUCCESSFULLY));
    }

    @PutMapping("/{publisherId}/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<PublisherResponse>> updatePublisher(
            @RequestBody PublisherUpdatedRequest updateRequest,
            @PathVariable Long publisherId){
        var result = publisherService.updatePublisher(updateRequest, publisherId);
        return ResponseEntity.ok(
                EBResponse.Success(result,
                        String.format(PublisherMessage.PUBLISHER_UPDATED_SUCCESSFULLY, publisherId)));
    }

    @DeleteMapping("/{publisherId}/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<?>> deletePublisher(@PathVariable Long publisherId){
        publisherService.deletePublisher(publisherId);
        return ResponseEntity.ok(
                EBResponse.Success(null,
                        String.format(PublisherMessage.PUBLISHER_DELETED_SUCCESSFULLY, publisherId)));
    }
}
