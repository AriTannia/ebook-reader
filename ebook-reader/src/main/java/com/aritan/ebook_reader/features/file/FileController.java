package com.aritan.ebook_reader.features.file;

import com.aritan.ebook_reader.common.constants.messages.FileMessage;
import com.aritan.ebook_reader.common.models.EBResponse;
import com.aritan.ebook_reader.features.file.utilities.FileHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import software.amazon.awssdk.http.SdkHttpMethod;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class FileController {
    private final IFileService fileService;

    @GetMapping("{filename}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<String> getUrl(@PathVariable String filename) {
        String url = fileService.generatePresignedUrl(filename, SdkHttpMethod.GET);
        return ResponseEntity.ok(url);
    }

    @PostMapping("/pre-signed-url")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<Map<String, Object>>> generateUrl(
            @RequestParam(name = "filename", required = false, defaultValue = "") String filename) {
        filename = FileHelper.buildFileName(filename);
        String url = fileService.generatePresignedUrl(filename, SdkHttpMethod.PUT);

        return ResponseEntity.ok(
                EBResponse.Success(
                        Map.of("url", url, "filename", filename),
                        FileMessage.PRESIGNED_URL_GENERATED_SUCCESSFULLY));
    }
}
