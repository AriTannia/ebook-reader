package com.aritan.ebook_reader.features.tag;

import com.aritan.ebook_reader.common.models.book.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ITagRepository extends JpaRepository<Tag, UUID> {
}
