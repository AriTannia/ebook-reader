package com.aritan.ebook_reader.features.author;

import com.aritan.ebook_reader.common.models.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IAuthorRepository extends
        JpaRepository<Author, Long>, JpaSpecificationExecutor<Author> {
}
