package com.aritan.ebook_reader.features.publisher;

import com.aritan.ebook_reader.common.models.book.Publisher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface IPublisherRepository extends
        JpaRepository<Publisher, Long>, JpaSpecificationExecutor<Publisher> {

}
