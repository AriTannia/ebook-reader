package com.aritan.ebook_reader.features.library.readinghistory;

import com.aritan.ebook_reader.common.models.order.OrderItem;
import com.aritan.ebook_reader.common.models.user.User;
import com.aritan.ebook_reader.features.library.dtos.ReadingProgressResponse;
import com.aritan.ebook_reader.features.library.dtos.SaveProgressRequest;

import java.util.List;

public interface IReadingProgressService {
    ReadingProgressResponse saveProgress(Long userId, SaveProgressRequest request);
    List<ReadingProgressResponse>  getRecentlyRead(Long userId, int limit);
    void markAsFinished(Long userId, Long bookId);

    // For changing format type by admin
    void resetProgressByBookId(Long bookId);
    void createReadingProgress(User user, OrderItem orderItem);
}
