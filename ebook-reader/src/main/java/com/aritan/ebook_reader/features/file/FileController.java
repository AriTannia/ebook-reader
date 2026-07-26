package com.aritan.ebook_reader.features.file;

import com.aritan.ebook_reader.common.constants.messages.file.FileMessage;
import com.aritan.ebook_reader.common.models.EBResponse;
import com.aritan.ebook_reader.features.file.utilities.FileHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class FileController {
    private final IFileService fileService;
    @PostMapping("/avatar/pre-signed-url")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<Map<String, Object>>> generateResignedAvatarUrl(
            @RequestParam(name = "filename", required = false, defaultValue = "") String filename) {
        filename = FileHelper.buildAvatarFileName(filename);
        String url = fileService.generatePublicPresignedUrl(filename);

        return ResponseEntity.ok(
                EBResponse.Success(
                        Map.of("url", url, "filename", filename),
                        FileMessage.PRESIGNED_URL_GENERATED_SUCCESSFULLY));
    }

    @PostMapping("/book/pre-signed-url")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<Map<String, Object>>> generateResignedBookUrl(
            @RequestParam(name = "filename", required = false, defaultValue = "") String filename) {
        filename = FileHelper.buildBookFileName(filename);
        String url = fileService.generatePublicPresignedUrl(filename);

        return ResponseEntity.ok(
                EBResponse.Success(
                        Map.of("url", url, "filename", filename),
                        FileMessage.PRESIGNED_URL_GENERATED_SUCCESSFULLY));
    }

    @PostMapping("/book-format/pre-signed-url")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<Map<String, Object>>> generateResignedBookFormatUrl(
            @RequestParam(name = "filename", required = false, defaultValue = "") String filename) {
        filename = FileHelper.buildBookFormatFileName(filename);
        String url = fileService.generatePrivatePresignedUrl(filename, Duration.ofMinutes(60));

        return ResponseEntity.ok(
                EBResponse.Success(
                        Map.of("url", url, "filename", filename),
                        FileMessage.PRESIGNED_URL_GENERATED_SUCCESSFULLY));
    }

    @DeleteMapping("/delete")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<String>> deleteFile(
            @RequestParam(name = "filename", required = false, defaultValue = "") String filename) {
        filename = FileHelper.buildAvatarFileName(filename);
        fileService.deleteFile(filename);
        return ResponseEntity.ok(
                EBResponse.Success(
                        filename,
                        String.format(FileMessage.FILE_DELETED_SUCCESSFULLY, filename)));
    }
}
