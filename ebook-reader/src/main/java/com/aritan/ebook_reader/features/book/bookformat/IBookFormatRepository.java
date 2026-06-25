package com.aritan.ebook_reader.features.book.bookformat;

import com.aritan.ebook_reader.common.models.Book;
import com.aritan.ebook_reader.common.models.BookFormat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IBookFormatRepository extends JpaRepository<BookFormat, Long> {
    List<BookFormat> findAllByBook_BookId(Long bookId);
}
