package com.aritan.ebook_reader.features.library.readinghistory;

import com.aritan.ebook_reader.common.enums.book.LibraryAccessStatus;
import com.aritan.ebook_reader.common.enums.book.ReadingStatus;
import com.aritan.ebook_reader.common.exception.InvalidRequestException;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.models.book.BookFormat;
import com.aritan.ebook_reader.common.models.book.ReadingProgress;
import com.aritan.ebook_reader.features.book.IBookRepository;
import com.aritan.ebook_reader.features.book.bookformat.IBookFormatRepository;
import com.aritan.ebook_reader.features.file.IFileService;
import com.aritan.ebook_reader.features.library.IUserLibraryRepository;
import com.aritan.ebook_reader.features.library.dtos.BookReaderResponse;
import com.aritan.ebook_reader.features.library.dtos.ReadingProgressResponse;
import com.aritan.ebook_reader.features.library.dtos.SaveProgressRequest;
import com.aritan.ebook_reader.features.library.utilities.ReadingProgressMapper;
import com.aritan.ebook_reader.features.user.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
@Service
@RequiredArgsConstructor
public class ReadingProgressService implements IReadingProgressService{
    private final IReadingProgressRepository readingProgressRepository;
    private final IUserLibraryRepository userLibraryRepository;
    private final IUserRepository userRepository;
    private final IBookRepository bookRepository;
    private final IBookFormatRepository bookFormatRepository;
    private final ReadingProgressMapper readingProgressMapper;
    private final IFileService fileService;
    @Override
    @Transactional
    public ReadingProgressResponse saveProgress(Long userId, SaveProgressRequest request) {
        boolean hasAccess = userLibraryRepository
                .existsByUser_UserIdAndBook_BookIdAndAccessStatus(
                        userId, request.getBookId(), LibraryAccessStatus.ACTIVE);

        if(!hasAccess){
            throw new InvalidRequestException("User does not have access to this book.");
        }

        ReadingProgress progress = readingProgressRepository
                .findByUser_UserIdAndBook_BookId(userId, request.getBookId())
                .orElseGet(() -> {
                    ReadingProgress newProgress = new ReadingProgress();
                    newProgress.setUser(userRepository.getReferenceById(userId));
                    newProgress.setBook(bookRepository.getReferenceById(request.getBookId()));
                    return newProgress;
                });

        progress.setLocator(request.getLocator());
        progress.setProgressPercent(request.getProgressPercent());
        progress.setLastReadAt(LocalDateTime.now());

        if(progress.getStatus() == ReadingStatus.NOT_STARTED){
            progress.setStatus(ReadingStatus.IN_PROGRESS);
        }

        readingProgressRepository.save(progress);
        return readingProgressMapper.toResponse(progress);
    }

    @Override
    public BookReaderResponse getBookForReading(Long userId, Long bookId) {
        boolean hasAccess = userLibraryRepository
                .existsByUser_UserIdAndBook_BookIdAndAccessStatus(
                        userId, bookId, LibraryAccessStatus.ACTIVE);

        if(!hasAccess){
            throw new InvalidRequestException("User does not have access to this book.");
        }

        BookFormat primaryFormat = bookFormatRepository
                .findByBook_BookIdAndIsPrimaryTrue(bookId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Primary format not found for bookId: " + bookId));

        String presingedUrl = fileService.generatePrivatePresignedUrl(primaryFormat.getStorageUrl(), Duration.ofMinutes(60));

        ReadingProgress progress = readingProgressRepository
                .findByUser_UserIdAndBook_BookId(userId, bookId)
                .orElse(null);

        BookReaderResponse response = readingProgressMapper.toBookReaderResponse(primaryFormat, presingedUrl);

        if (progress != null) {
            response.setLocator(progress.getLocator());
            response.setProgressPercent(progress.getProgressPercent());
        } else {
            response.setLocator(null);
            response.setProgressPercent(BigDecimal.ZERO);
        }

        return response;
    }

    @Override
    public List<ReadingProgressResponse> getRecentlyRead(Long userId, int limit) {
        Pageable pageable = PageRequest.ofSize(limit);

        return readingProgressRepository
                .findByUser_UserIdOrderByLastReadAtDesc(userId, pageable)
                .stream()
                .map(readingProgressMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public void markAsFinished(Long userId, Long bookId) {
        ReadingProgress progress = readingProgressRepository
                .findByUser_UserIdAndBook_BookId(userId, bookId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Reading progress not found for userId: "
                                + userId + " and bookId: " + bookId));

        progress.setStatus(ReadingStatus.FINISHED);
        progress.setProgressPercent(BigDecimal.valueOf(100));
        progress.setFinishedAt(LocalDateTime.now());

        readingProgressRepository.save(progress);
    }

    @Override
    @Transactional
    public void resetProgressByBookId(Long bookId) {
        readingProgressRepository.deleteByBook_BookId(bookId);
    }
}
